'use client'

import { useTheme } from 'next-themes'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, User } from 'lucide-react'
import type { UserProfile } from '@/lib/types'

interface ProfileReplaceConfirmProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentProfile: UserProfile | null | undefined
  newProfile: UserProfile | null
  onKeepOld: () => void
  onReplace: () => void
  onCancel: () => void
}

export function ProfileReplaceConfirm({
  open,
  onOpenChange,
  currentProfile,
  newProfile,
  onKeepOld,
  onReplace,
  onCancel,
}: ProfileReplaceConfirmProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`!max-w-sm ${
          isDark ? 'bg-slate-950 border-border' : 'bg-white border-border'
        } border`}
      >
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <DialogTitle
              className={`${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              Replace Profile?
            </DialogTitle>
          </div>
          <DialogDescription
            className={`text-sm ${
              isDark ? 'text-white/60' : 'text-slate-600'
            }`}
          >
            You already have a profile loaded. Would you like to replace it with the new one?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Profile Comparison */}
          <div className="grid grid-cols-2 gap-3">
            {/* Current Profile */}
            <div
              className={`p-3 rounded-sm border ${
                isDark
                  ? 'border-border-light bg-white/5'
                  : 'border-border bg-secondary'
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-widest ${
                  isDark ? 'text-white/50' : 'text-slate-500'
                } mb-2`}
              >
                Current
              </p>
              <div className="flex items-center gap-2">
                <User
                  className={`w-4 h-4 flex-shrink-0 ${
                    isDark ? 'text-white/60' : 'text-slate-600'
                  }`}
                />
                <p
                  className={`text-sm font-medium truncate ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                  title={currentProfile?.username}
                >
                  {currentProfile?.username || 'N/A'}
                </p>
              </div>
            </div>

            {/* New Profile */}
            <div
              className={`p-3 rounded-sm border ${
                isDark
                  ? 'border-emerald-500/30 bg-emerald-500/10'
                  : 'border-emerald-200 bg-emerald-50'
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-widest ${
                  isDark ? 'text-emerald-400' : 'text-emerald-700'
                } mb-2`}
              >
                New
              </p>
              <div className="flex items-center gap-2">
                <User
                  className={`w-4 h-4 flex-shrink-0 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-700'
                  }`}
                />
                <p
                  className={`text-sm font-medium truncate ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                  title={newProfile?.username}
                >
                  {newProfile?.username || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={onReplace}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm font-medium py-2"
            >
              Replace Profile
            </Button>
            <Button
              onClick={onKeepOld}
              variant="outline"
              className={`w-full rounded-sm font-medium py-2 ${
                isDark
                  ? 'border-border-light text-white hover:bg-white/10'
                  : 'border-border text-foreground hover:bg-muted'
              }`}
            >
              Keep Current
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className={`w-full rounded-sm font-medium py-2 ${
                isDark
                  ? 'border-border-light text-white hover:bg-white/10'
                  : 'border-border text-foreground hover:bg-muted'
              }`}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
