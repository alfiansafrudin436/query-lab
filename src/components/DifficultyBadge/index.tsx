import { Badge } from '@/components/Badge'
import { DIFFICULTY_LABEL } from '@/lib/dialects'
import type { Difficulty } from '@/types'

type DifficultyBadgeProps = {
  difficulty: Difficulty
  className?: string
}

export const DifficultyBadge = ({ difficulty, className }: DifficultyBadgeProps) => {
  return (
    <Badge variant={difficulty} className={className}>
      {DIFFICULTY_LABEL[difficulty]}
    </Badge>
  )
}
