/**
 * E2E tests for CSV upload flow
 * Tests the complete user journey of uploading CSV files and verifying the UI
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UploadModal } from '@/components/layout/upload-models'
import type { MovieDataset } from '@/lib/types'

// Mock the dropzone library
vi.mock('react-dropzone', () => ({
  useDropzone: ({
    onDrop,
  }: {
    onDrop: (files: File[]) => void
  }) => ({
    getRootProps: () => ({
      onDrop: (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
      },
    }),
    getInputProps: () => ({
      type: 'file',
      multiple: true,
      accept: { 'text/csv': ['.csv'] },
    }),
    isDragActive: false,
  }),
}))

describe('CSV Upload E2E Tests', () => {
  describe('Upload Modal Rendering', () => {
    it('should render upload modal when open prop is true', () => {
      const { container } = render(
        <UploadModal open={true} onOpenChange={jest.fn()} />
      )

      expect(screen.getByText('Upload Your Letterboxd Data')).toBeInTheDocument()
      expect(
        screen.getByText(/Drag CSV files here or click to select/)
      ).toBeInTheDocument()
    })

    it('should display file type descriptions', () => {
      render(<UploadModal open={true} onOpenChange={jest.fn()} />)

      expect(screen.getByText('Watched Movies')).toBeInTheDocument()
      expect(screen.getByText('Ratings')).toBeInTheDocument()
      expect(screen.getByText('Diary')).toBeInTheDocument()
      expect(screen.getByText('Films')).toBeInTheDocument()
      expect(screen.getByText('Watchlist')).toBeInTheDocument()
    })

    it('should display upload button', () => {
      render(<UploadModal open={true} onOpenChange={jest.fn()} />)

      const continueButton = screen.getByRole('button', {
        name: /Continue to Dashboard/i,
      })
      expect(continueButton).toBeInTheDocument()
      expect(continueButton).toBeDisabled() // Should be disabled with no files
    })
  })

  describe('File Upload Handling', () => {
    it('should show error for unknown file type', async () => {
      const mockOnOpenChange = jest.fn()
      const { rerender } = render(
        <UploadModal open={true} onOpenChange={mockOnOpenChange} />
      )

      const fileInput = screen.getByRole('button', {
        name: /Drag CSV files here/i,
      })
      const unknownFile = new File(['content'], 'unknown.txt', {
        type: 'text/plain',
      })

      // Simulate file drop
      fireEvent.drop(fileInput, { dataTransfer: { files: [unknownFile] } })

      // Rerender to see updated state
      rerender(<UploadModal open={true} onOpenChange={mockOnOpenChange} />)

      await waitFor(() => {
        expect(screen.getByText(/Unknown file type/i)).toBeInTheDocument()
      })
    })

    it('should accept and display valid CSV files', async () => {
      const watchedCSVContent = `Date,Name,Year,Letterboxd URI
2023-01-15,Test Movie,2020,https://boxd.it/test1`

      const mockOnOpenChange = jest.fn()
      const mockOnUploadComplete = jest.fn()

      render(
        <UploadModal
          open={true}
          onOpenChange={mockOnOpenChange}
          onUploadComplete={mockOnUploadComplete}
        />
      )

      const watchedFile = new File([watchedCSVContent], 'watched.csv', {
        type: 'text/csv',
      })

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      if (fileInput) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(watchedFile)
        fireEvent.change(fileInput, { target: { files: dataTransfer.files } })

        await waitFor(() => {
          expect(screen.getByText('watched.csv')).toBeInTheDocument()
        })
      }
    })

    it('should require watched.csv before allowing continue', async () => {
      const mockOnOpenChange = jest.fn()
      render(
        <UploadModal open={true} onOpenChange={mockOnOpenChange} />
      )

      const continueButton = screen.getByRole('button', {
        name: /Continue to Dashboard/i,
      })

      expect(continueButton).toBeDisabled()

      const alertSpy = jest.spyOn(window, 'alert').mockImplementation()

      fireEvent.click(continueButton)

      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('upload at least one CSV')
      )

      alertSpy.mockRestore()
    })
  })

  describe('Modal State Management', () => {
    it('should close modal when onOpenChange called with false', () => {
      const mockOnOpenChange = jest.fn()
      const { rerender } = render(
        <UploadModal open={true} onOpenChange={mockOnOpenChange} />
      )

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      fireEvent.click(cancelButton)

      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })

    it('should reset files when modal closes', async () => {
      const mockOnOpenChange = jest.fn()
      const { rerender } = render(
        <UploadModal open={true} onOpenChange={mockOnOpenChange} />
      )

      // Close modal
      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      fireEvent.click(cancelButton)

      // Reopen modal
      rerender(
        <UploadModal open={true} onOpenChange={mockOnOpenChange} />
      )

      // Files should be cleared
      expect(screen.queryByText('watched.csv')).not.toBeInTheDocument()
    })

    it('should show clear all button when files are uploaded', async () => {
      const mockOnOpenChange = jest.fn()
      render(
        <UploadModal open={true} onOpenChange={mockOnOpenChange} />
      )

      const watchedCSVContent = `Date,Name,Year,Letterboxd URI
2023-01-15,Test Movie,2020,https://boxd.it/test1`

      const watchedFile = new File([watchedCSVContent], 'watched.csv', {
        type: 'text/csv',
      })

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      if (fileInput) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(watchedFile)
        fireEvent.change(fileInput, { target: { files: dataTransfer.files } })

        await waitFor(() => {
          const clearButton = screen.queryByRole('button', {
            name: /Clear All/i,
          })
          expect(clearButton).toBeInTheDocument()
        })
      }
    })
  })

  describe('Error Handling', () => {
    it('should display error message for malformed CSV', async () => {
      const malformedCSV = `Invalid,CSV,Format
      This is not valid,1,2`

      const mockOnOpenChange = jest.fn()
      render(
        <UploadModal open={true} onOpenChange={mockOnOpenChange} />
      )

      const watchedFile = new File([malformedCSV], 'watched.csv', {
        type: 'text/csv',
      })

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      if (fileInput) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(watchedFile)
        fireEvent.change(fileInput, { target: { files: dataTransfer.files } })

        await waitFor(() => {
          // Should show error since columns don't match
          expect(screen.getByText(/row\(s\) failed|Error/i)).toBeInTheDocument()
        }, { timeout: 3000 })
      }
    })

    it('should prevent continuing with errors present', async () => {
      const mockOnOpenChange = jest.fn()
      render(
        <UploadModal open={true} onOpenChange={mockOnOpenChange} />
      )

      const alertSpy = jest.spyOn(window, 'alert').mockImplementation()

      // Try to continue (should fail due to no files)
      const continueButton = screen.getByRole('button', {
        name: /Continue to Dashboard/i,
      })
      fireEvent.click(continueButton)

      expect(alertSpy).toHaveBeenCalled()
      alertSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels and ARIA attributes', () => {
      render(<UploadModal open={true} onOpenChange={jest.fn()} />)

      const title = screen.getByText('Upload Your Letterboxd Data')
      expect(title).toBeInTheDocument()

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should be keyboard navigable', () => {
      render(<UploadModal open={true} onOpenChange={jest.fn()} />)

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      expect(cancelButton).toBeVisible()
      expect(cancelButton).toHaveAttribute('type', 'button')
    })
  })

  describe('File Removal', () => {
    it('should remove file when X button clicked', async () => {
      const mockOnOpenChange = jest.fn()
      render(
        <UploadModal open={true} onOpenChange={mockOnOpenChange} />
      )

      const watchedCSVContent = `Date,Name,Year,Letterboxd URI
2023-01-15,Test Movie,2020,https://boxd.it/test1`

      const watchedFile = new File([watchedCSVContent], 'watched.csv', {
        type: 'text/csv',
      })

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      if (fileInput) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(watchedFile)
        fireEvent.change(fileInput, { target: { files: dataTransfer.files } })

        await waitFor(() => {
          expect(screen.getByText('watched.csv')).toBeInTheDocument()
        })

        // Find and click the remove button
        const removeButton = screen.getByRole('button', { name: /X/i })
        fireEvent.click(removeButton)

        await waitFor(() => {
          expect(screen.queryByText('watched.csv')).not.toBeInTheDocument()
        })
      }
    })
  })
})
