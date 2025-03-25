# Balatro Color Tags Reference

The Balatro localization files use special formatting tags in curly braces like `{C:attention}` or `{C:red}`. This document maps these tags to their corresponding color hex codes.

## Color Tags and Their Hex Codes

| Tag | Hex Code | Color Sample | Description |
|-----|----------|--------------|-------------|
| `{C:red}` | #FE5F55 | ![#FE5F55](https://via.placeholder.com/15/FE5F55/000000?text=+) | Red color, used for negative effects and Hearts/Diamonds suits |
| `{C:mult}` | #FE5F55 | ![#FE5F55](https://via.placeholder.com/15/FE5F55/000000?text=+) | Used for multiplier texts (same as red) |
| `{C:blue}` | #009DFF | ![#009DFF](https://via.placeholder.com/15/009DFF/000000?text=+) | Blue color, used for positive effects and references to hands |
| `{C:chips}` | #009DFF | ![#009DFF](https://via.placeholder.com/15/009DFF/000000?text=+) | Used for chip amounts (same as blue) |
| `{C:green}` | #4BC292 | ![#4BC292](https://via.placeholder.com/15/4BC292/000000?text=+) | Green color, often used for positive effects |
| `{C:money}` | #F3B958 | ![#F3B958](https://via.placeholder.com/15/F3B958/000000?text=+) | Gold/yellow color used for money values |
| `{C:gold}` | #EAC058 | ![#EAC058](https://via.placeholder.com/15/EAC058/000000?text=+) | Similar to money color, slightly different shade |
| `{C:attention}` | #FF9A00 | ![#FF9A00](https://via.placeholder.com/15/FF9A00/000000?text=+) | Orange color used to highlight important text |
| `{C:purple}` | #8867A5 | ![#8867A5](https://via.placeholder.com/15/8867A5/000000?text=+) | Purple color used for special effects and some rare items |
| `{C:white}` | #FFFFFF | ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/000000?text=+) | White color, default text color |
| `{C:inactive}` | #88888899 | ![#88888899](https://via.placeholder.com/15/888888/000000?text=+) | Grey color with transparency, used for inactive or lesser importance text |
| `{C:spades}` | #374649 | ![#374649](https://via.placeholder.com/15/374649/000000?text=+) | Dark color used for Spades suit |
| `{C:hearts}` | #FE5F55 | ![#FE5F55](https://via.placeholder.com/15/FE5F55/000000?text=+) | Same as red, used for Hearts suit |
| `{C:clubs}` | #424E54 | ![#424E54](https://via.placeholder.com/15/424E54/000000?text=+) | Dark color used for Clubs suit |
| `{C:diamonds}` | #FE5F55 | ![#FE5F55](https://via.placeholder.com/15/FE5F55/000000?text=+) | Same as red, used for Diamonds suit |
| `{C:tarot}` | #A782D1 | ![#A782D1](https://via.placeholder.com/15/A782D1/000000?text=+) | Purple color used for Tarot cards |
| `{C:planet}` | #13AFCE | ![#13AFCE](https://via.placeholder.com/15/13AFCE/000000?text=+) | Teal/cyan color used for Planet cards |
| `{C:spectral}` | #4584FA | ![#4584FA](https://via.placeholder.com/15/4584FA/000000?text=+) | Blue color used for Spectral cards |
| `{C:edition}` | #FFFFFF | ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/000000?text=+) | White color for edition references |
| `{C:dark_edition}` | #000000 | ![#000000](https://via.placeholder.com/15/000000/FFFFFF?text=+) | Black color used for special edition references |
| `{C:legendary}` | #B26CBB | ![#B26CBB](https://via.placeholder.com/15/B26CBB/000000?text=+) | Purple color used for legendary rarities |
| `{C:enhanced}` | #8389DD | ![#8389DD](https://via.placeholder.com/15/8389DD/000000?text=+) | Blue-purple color used for enhanced cards |

## Other Tags

The localization files may also include other formatting tags:

| Tag | Description |
|-----|-------------|
| `{E:1}` | Used for special effects like text floating or animation |
| `{s:1.2}` | Used to scale text size (example shows 1.2× scaling) |
| `{#1#}` | Variable substitution placeholder (usually for dynamic numbers) |

## Example Usage

Here's an example of how these tags are used in localization text:

```lua
c_soul={
    name="The Soul",
    text={
        "Creates a",
        "{C:legendary,E:1}Legendary{} Joker",
        "{C:inactive}(Must have room)",
    },
},
```

This creates text with the word "Legendary" in purple color with a special effect (likely animated), and the parenthetical note in gray color. 