import React from 'react'
import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline";

const StarRating = ({ rating, maxStars = 5, filledColor = "gold", emptyColor = "gray", size = 24 }) => {
    return (
      <>
        {Array.from({ length: maxStars }).map((_, index) => {
          const fillPercentage = Math.min(Math.max(rating - index, 0), 1) * 100; // Fill logic
          
          return (
            <div key={index} style={{ position: "relative", width: size, height: size}}>
              {/* Outline Star as Background */}
              <OutlineStar style={{ color: emptyColor, width: size, height: size, position: "absolute" ,left:'0'}} />
  
              {/* Partially Filled Star */}
              <div style={{ 
                position: "absolute", 
                overflow: "hidden", 
                width: `${fillPercentage + (fillPercentage > 50 ? -7 : 7)}%`, 
                height: "100%" 
              }}>
                <SolidStar style={{ color: filledColor, width: size, height: size ,position: "absolute" ,left:'0'}} />
              </div>
            </div>
          );
        })}
        </>
    );
  };

  const RatingInput = ({ maxStars = 5, size = 30, filledColor = "gold", emptyColor = "gray", takeInput , id}) => {
    const [hovered, setHovered] = React.useState(0);  // Track hover state
    const [selected, setSelected] = React.useState(0); // Track selected rating
    
    const handleClick = (rating) => {
      setSelected(rating);
    };

    async function handleRatingSubmit() {
        const res = await fetch(`/api/rating/${id}`,{
            method:'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating: selected })
        })
        const data = await res.json()
        console.log(data);
        
         takeInput(false)
    }
   

    return (
        <div style={{ display: "flex", flexDirection:'column', gap: "8px", cursor: "pointer" 
            ,position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0, 0, 0, 0.8)', 
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
           }}>
      <div style={{ display: "flex",  gap: "8px", cursor: "pointer" 
           }}>
        {Array.from({ length: maxStars }).map((_, index) => {
          const starIndex = index + 1;
          const isFilled = starIndex <= (hovered || selected);
  
          return (
            <div
              key={starIndex}
              onMouseEnter={() => setHovered(starIndex)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => handleClick(starIndex) }
              style={{ transition: "transform 0.2s", transform: hovered === starIndex ? "scale(1.2)" : "scale(1)" }}
            >
              {isFilled ? (
                <SolidStar style={{ color: filledColor, width: size, height: size }} />
              ) : (
                <OutlineStar style={{ color: emptyColor, width: size, height: size }} />
              )}
            </div>
            
          );
        })}
        
      </div>
      <button className='rating-button' onClick={handleRatingSubmit}>Submit</button>
      </div>
    );
  };
  
  
export {RatingInput, StarRating}  