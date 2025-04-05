# Steam Clone Styling Guide

## Navigation Bars

### Main Navigation Bar
- Height: `h-20` (80px)
- Background: `bg-[#171a21]`
- Text Color: `text-[#b8b6b4]` (default), `text-white` (hover)
- Font Weight: `font-medium`
- Spacing between items: `space-x-6`
- Left margin for navigation links: `ml-20`

To modify:
```css
/* Change height */
h-{number} /* e.g., h-24 for 96px */

/* Change background color */
bg-[#{hex-color}] /* e.g., bg-[#1a1a1a] */

/* Change text color */
text-[#{hex-color}] /* e.g., text-[#ffffff] */

/* Change hover color */
hover:text-[#{hex-color}] /* e.g., hover:text-[#ffffff] */

/* Change spacing */
space-x-{number} /* e.g., space-x-8 */
ml-{number} /* e.g., ml-24 */
```

### Store Navigation Bar
- Height: `h-{number}` (adjustable)
- Background: `bg-[#171a21]`
- Border: `border-t border-[#2a3f5a]`
- Text Color: `text-[#b8b6b4]` (default), `text-white` (hover)
- Font Size: `text-sm`
- Search Bar Width: `max-w-xs`

To modify:
```css
/* Change height */
h-{number} /* e.g., h-10 for 40px */

/* Change background color */
bg-[#{hex-color}] /* e.g., bg-[#1a1a1a] */

/* Change border color */
border-[#{hex-color}] /* e.g., border-[#3a4f6a] */

/* Change search bar width */
max-w-{size} /* e.g., max-w-sm, max-w-md */
```

## Featured Games Section
- Height: `h-[400px]`
- Background: `bg-[#1b2838]`
- Navigation Buttons: 
  - Background: `bg-black bg-opacity-50`
  - Hover: `hover:bg-opacity-75`
  - Text Color: `text-white`

To modify:
```css
/* Change height */
h-[{number}px] /* e.g., h-[500px] */

/* Change background color */
bg-[#{hex-color}] /* e.g., bg-[#1a1a1a] */

/* Change button opacity */
bg-opacity-{number} /* e.g., bg-opacity-60 */
```

## Game Grid Section
- Grid Layout: `grid grid-cols-5 gap-4`
- Card Background: `bg-[#171a21]`
- Card Hover: `hover:bg-[#1a1a1a]`
- Card Border: `border border-[#2a3f5a]`

To modify:
```css
/* Change grid columns */
grid-cols-{number} /* e.g., grid-cols-4 */

/* Change gap between items */
gap-{number} /* e.g., gap-6 */

/* Change card background */
bg-[#{hex-color}] /* e.g., bg-[#1a1a1a] */

/* Change hover color */
hover:bg-[#{hex-color}] /* e.g., hover:bg-[#1f1f1f] */
```

## General Color Palette
- Primary Background: `#1b2838`
- Secondary Background: `#171a21`
- Accent Color: `#5c7e10`
- Accent Hover: `#6c8c1e`
- Text Primary: `#ffffff`
- Text Secondary: `#b8b6b4`
- Border Color: `#2a3f5a`
- Search Bar Background: `#316282` 