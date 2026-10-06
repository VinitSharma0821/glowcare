import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, size = 'w-4 h-4', showScore = false, reviewsCount = null }) => {
  const rounded = Math.round(rating * 10) / 10;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <Star
              key={star}
              className={`${size} ${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : half
                  ? 'fill-amber-200 text-amber-400'
                  : 'fill-stone-200 text-stone-200'
              }`}
            />
          );
        })}
      </div>
      {showScore && <span className="text-xs font-semibold text-stone-700">{rounded.toFixed(1)}</span>}
      {reviewsCount !== null && (
        <span className="text-xs text-stone-400">({reviewsCount})</span>
      )}
    </div>
  );
};

export default RatingStars;
