import re
import os

def normalize_title(title):
    """
    Normalizes a movie title for consistent comparison and deduplication.
    Replaces smart quotes, removes common punctuation, and converts to lowercase.
    """
    title = title.replace('’', "'").replace('—', '-')
    # Remove any character that is not alphanumeric, space, colon, hyphen, or apostrophe
    # Corrected regex to handle single quote inside character class by placing hyphen at the end
    title = re.sub(r'[^a-zA-Z0-9\s:\'-]', '', title)
    return title.lower().strip()

def process_playlist_file(input_filepath):
    """
    Reads a messy movie playlist file, extracts metadata and movie entries,
    deduplicates, sorts, and formats them into a clean Markdown string.
    """
    with open(input_filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.strip().split('\n')
    
    list_title = "Unknown List Title"
    list_short_version = "Unknown Short Version"
    list_url = ""
    
    # Store lines that are potential metadata to avoid processing them as movies
    metadata_candidate_lines = []
    
    # Extract metadata more robustly
    temp_title = ""
    temp_short_version = ""
    temp_url = ""

    for line_idx, line in enumerate(lines):
        stripped_line = line.strip()
        if not stripped_line:
            continue
        
        # Heuristic for metadata: expect title, short version, and URL near the top
        if not temp_title:
            temp_title = stripped_line
            metadata_candidate_lines.append(stripped_line)
        elif not temp_short_version and len(stripped_line.split()) > 2 and stripped_line != temp_title and line_idx < 5: # Only check near the top
            temp_short_version = stripped_line
            metadata_candidate_lines.append(stripped_line)
        elif stripped_line.startswith("https://") and not temp_url and line_idx < 10: # Only check near the top
            temp_url = stripped_line
            metadata_candidate_lines.append(stripped_line)
        
        if temp_title and temp_short_version and temp_url:
            break
            
    list_title = temp_title if temp_title else os.path.splitext(os.path.basename(input_filepath))[0]
    list_short_version = temp_short_version if temp_short_version else list_title
    list_url = temp_url


    movie_entries_processed = {} # Use dict to store (normalized_title, year) -> (original_title, year)

    # Two main patterns for robustness: one where year is in parentheses, one where it's direct.
    # We will prioritize year in parentheses for better parsing.
    
    # General movie title component allowing many characters found in titles
    # This specifically excludes the year pattern to ensure non-greedy capture
    title_chars = r"[\w\s:'\-,.&()/—\[\]\*½]+"

    movie_pattern_paren = re.compile(
        r"(?:^\s*\d+\s*)?"  # Optional leading number (e.g., "1", "10")
        r"(?:Poster for\s*)?" # Optional "Poster for "
        r"(" + title_chars + r"?)" # Group 1: Non-greedy capture for Title
        r"\s+\((\d{{4}})\"" # Year explicitly in parentheses
        r"(?:\s*[\*½]*\s*(?:Read Review|Show Reviews)?)?" # Optional ratings and review text
        , re.IGNORECASE
    )

    movie_pattern_direct = re.compile(
        r"(?:^\s*\d+\s*)?"  # Optional leading number (e.g., "1", "10")
        r"(?:Poster for\s*)?" # Optional "Poster for "
        r"(" + title_chars + r"?)" # Group 1: Non-greedy capture for Title
        r"\s+(\d{{4}})" # Year directly (not in parentheses)
        r"(?:\s*[\*½]*\s*(?:Read Review|Show Reviews)?)?" # Optional ratings and review text
        , re.IGNORECASE
    )

    for line in lines:
        stripped_line = line.strip()
        if not stripped_line:
            continue
        
        # Skip metadata lines that might appear later
        if stripped_line in metadata_candidate_lines:
            continue

        title_raw = ""
        year = ""
        
        # Try matching year in parentheses first (more specific)
        match = movie_pattern_paren.search(stripped_line)
        if match:
            title_raw = match.group(1).strip()
            year = match.group(2)
        else: # Then try matching year directly
            match = movie_pattern_direct.search(stripped_line)
            if match:
                title_raw = match.group(1).strip()
                year = match.group(2)

        if title_raw and year:
            # Further clean up the title:
            # Remove any leading numbers that slipped through if they don't seem like part of the title
            # e.g., "1All of Us Strangers" -> "All of Us Strangers" but "2001: A Space Odyssey" remains "2001: A Space Odyssey"
            # This logic now correctly handles cases like "2001: A Space Odyssey" by not removing the leading numbers
            # if they are followed by a non-space character (like a colon in this case).
            if not re.match(r'^\d+[\s:]', title_raw): # If it doesn't start with "NUMBER " or "NUMBER:"
                 title_raw = re.sub(r'^\d+\s*', '', title_raw).strip()
            
            # Remove "Poster for" prefix explicitly if it was captured
            title_raw = re.sub(r'^Poster for\s*', '', title_raw).strip()

            # Remove trailing junk like ratings, review links if not caught by regex
            title_raw = re.sub(r'\s*[\*½]+\s*(?:Read Review|Show Reviews)?$', '', title_raw).strip()
            
            # Remove any trailing year if it was captured as part of the title (e.g. "Movie Title 1999" -> "Movie Title")
            title_raw = re.sub(r'\s+\d{{4}}$', '', title_raw).strip()
            
            # Additional cleanup for titles that might have leading numbers from list (e.g., "627Vivre Sa Vie")
            title_raw = re.sub(r'^\d+', '', title_raw).strip()


            # Exclude specific non-movie entries or problematic patterns
            if not title_raw or title_raw.startswith("http") or \
               "movies you must see" in title_raw.lower() or \
               title_raw.startswith("Trip to the Moon") and year == "1902" and len(title_raw.split()) < 4 : # Specific for Trip to the Moon (1902) issue
                continue
            
            # Final check to ensure title isn't just a number or too short
            if len(title_raw) < 2 and not re.match(r'^\d+$', title_raw):
                 continue


            normalized_key = (normalize_title(title_raw), year)
            
            # Prefer original casing/spacing of the first encountered title for output,
            # but ensure uniqueness based on normalized key.
            if normalized_key not in movie_entries_processed:
                movie_entries_processed[normalized_key] = (title_raw, year)
            else:
                # If a movie already exists, and the current title_raw looks "better" (e.g., more complete), update it.
                # This is a heuristic and might need fine-tuning.
                existing_title, _ = movie_entries_processed[normalized_key]
                if len(title_raw) > len(existing_title):
                    movie_entries_processed[normalized_key] = (title_raw, year)


    # Convert dict values to a list of (original_title, year) tuples for sorting
    sorted_movies = sorted(list(movie_entries_processed.values()), key=lambda x: normalize_title(x[0]))

    formatted_output = f"""List Title: {list_title}
List Short Version: {list_short_version}
List URL: {list_url}

Movies:
"""
    for movie_title, movie_year in sorted_movies:
        formatted_output += f"- {movie_title} ({movie_year})\n"
        
    return formatted_output

if __name__ == "__main__":
    input_dir = "docs/playlists/new canon"
    output_dir = "docs/playlists/new canon" # Overwrite in the same directory, or specify new one

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for filename in os.listdir(input_dir):
        if filename.endswith(".txt"):
            input_filepath = os.path.join(input_dir, filename)
            output_filename = os.path.splitext(filename)[0] + ".md"
            output_filepath = os.path.join(output_dir, output_filename)

            print(f"Processing {input_filepath}...")
            formatted_content = process_playlist_file(input_filepath)

            with open(output_filepath, 'w', encoding='utf-8') as f:
                f.write(formatted_content)
            print(f"Formatted content written to {output_filepath}")

            # Optionally, remove the original .txt file after processing
            # os.remove(input_filepath)
            # print(f"Original file {input_filepath} removed.")
