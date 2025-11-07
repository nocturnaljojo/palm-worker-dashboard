'use client'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/**
 * Professional circular avatar component displaying user initials
 * with consistent color-coded backgrounds based on name hash
 */
export default function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const initials = getInitials(name)
  const colorClass = getColorFromName(name)
  const sizeClasses = getSizeClasses(size)

  return (
    <div
      className={`
        ${sizeClasses.container}
        ${colorClass}
        rounded-full
        flex
        items-center
        justify-center
        font-semibold
        text-white
        select-none
        ${className}
      `}
      title={name}
    >
      <span className={sizeClasses.text}>{initials}</span>
    </div>
  )
}

/**
 * Extract initials from name (First + Last letter of name)
 * Handles edge cases: single names, special characters, empty strings
 */
function getInitials(name: string): string {
  if (!name || typeof name !== 'string') {
    return '?'
  }

  // Clean name: remove special characters, trim whitespace
  const cleaned = name.trim().replace(/[^a-zA-Z\s]/g, '')

  if (!cleaned) {
    return '?'
  }

  // Split into words and filter empty strings
  const words = cleaned.split(/\s+/).filter(word => word.length > 0)

  if (words.length === 0) {
    return '?'
  }

  if (words.length === 1) {
    // Single name: take first letter only
    return words[0].charAt(0).toUpperCase()
  }

  // Multiple names: First letter of first word + First letter of last word
  const firstInitial = words[0].charAt(0).toUpperCase()
  const lastInitial = words[words.length - 1].charAt(0).toUpperCase()

  return `${firstInitial}${lastInitial}`
}

/**
 * Hash name to consistent color from professional palette
 * Same name always produces same color
 */
function getColorFromName(name: string): string {
  // Professional, accessible color palette
  const colors = [
    'bg-blue-600',      // Professional blue
    'bg-purple-600',    // Creative purple
    'bg-green-600',     // Fresh green
    'bg-orange-600',    // Energetic orange
    'bg-pink-600',      // Warm pink
    'bg-indigo-600',    // Deep indigo
    'bg-teal-600',      // Modern teal
    'bg-cyan-600',      // Bright cyan
    'bg-emerald-600',   // Rich emerald
    'bg-violet-600',    // Elegant violet
    'bg-fuchsia-600',   // Bold fuchsia
    'bg-rose-600',      // Soft rose
  ]

  if (!name || typeof name !== 'string') {
    return 'bg-gray-500' // Default fallback
  }

  // Simple hash function for consistent color selection
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash // Convert to 32-bit integer
  }

  // Map hash to color index
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

/**
 * Get size-specific CSS classes
 */
function getSizeClasses(size: 'sm' | 'md' | 'lg' | 'xl') {
  const sizeMap = {
    sm: {
      container: 'w-8 h-8',
      text: 'text-xs'
    },
    md: {
      container: 'w-10 h-10',
      text: 'text-sm'
    },
    lg: {
      container: 'w-12 h-12',
      text: 'text-base'
    },
    xl: {
      container: 'w-16 h-16',
      text: 'text-xl'
    }
  }

  return sizeMap[size]
}
