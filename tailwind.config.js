/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundSize: {
                'full': '100% 100%',
            },
            backgroundImage: {
                "face-smile-down": "url('/svg/faces/Winmine XP/smilefacedown.svg')",
                "face-smile": "url('/svg/faces/Winmine XP/smileface.svg')",
                "face-click": "url('/svg/faces/Winmine XP/clickface.svg')",
                "face-win": "url('/svg/faces/Winmine XP/winface.svg')",
                "face-lost": "url('/svg/faces/Winmine XP/lostface.svg')",
                "border-top-left": "url('/svg/border/WinmineXP/topleft.svg')",
                "border-top": "url('/svg/border/WinmineXP/top.svg')",
                "border-top-right": "url('/svg/border/WinmineXP/topright.svg')",
                "border-left": "url('/svg/border/WinmineXP/left.svg')",
                "border-right": "url('/svg/border/WinmineXP/right.svg')",
                "border-middle-left": "url('/svg/border/WinmineXP/middleleft.svg')",
                "border-middle": "url('/svg/border/WinmineXP/middle.svg')",
                "border-middle-right": "url('/svg/border/WinmineXP/middleright.svg')",
                "border-bottom-left": "url('/svg/border/WinmineXP/bottomleft.svg')",
                "border-bottom": "url('/svg/border/WinmineXP/bottom.svg')",
                "border-bottom-right": "url('/svg/border/WinmineXP/bottomright.svg')",
                "cell-1": "url('/svg/cells/WinmineXP/cell1.svg')",
                "cell-2": "url('/svg/cells/WinmineXP/cell2.svg')",
                "cell-3": "url('/svg/cells/WinmineXP/cell3.svg')",
                "cell-4": "url('/svg/cells/WinmineXP/cell4.svg')",
                "cell-5": "url('/svg/cells/WinmineXP/cell5.svg')",
                "cell-6": "url('/svg/cells/WinmineXP/cell6.svg')",
                "cell-7": "url('/svg/cells/WinmineXP/cell7.svg')",
                "cell-8": "url('/svg/cells/WinmineXP/cell8.svg')",
                "cell-up": "url('/svg/cells/WinmineXP/cellup.svg')",
                "cell-down": "url('/svg/cells/WinmineXP/celldown.svg')",
                "cell-flag": "url('/svg/cells/WinmineXP/cellflag.svg')",
                "cell-mine": "url('/svg/cells/WinmineXP/cellmine.svg')",
                "cell-false-mine": "url('/svg/cells/WinmineXP/falsemine.svg')",
                "cell-blast": "url('/svg/cells/WinmineXP/blast.svg')",
            }
        },
    },
    plugins: [],
}

