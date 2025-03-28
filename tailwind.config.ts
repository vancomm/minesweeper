import { Config } from "tailwindcss"

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                'halfspinto': {
                    '0%': {
                        transform: 'rotate(0deg)',
                    },
                    '100%': {
                        transform: 'rotate(-180deg)',
                    },
                },
                'halfspinfrom': {
                    '0%': {
                        transform: 'rotate(-180deg)',
                    },
                    '100%': {
                        transform: 'rotate(0deg)',
                    },
                },
            },
            animation: {
                'half-spin-to': 'halfspinto 200ms linear both',
                'half-spin-from': 'halfspinfrom 200ms linear both',
            },
            backgroundSize: {
                'full': '100% 100%',
            },
            backgroundImage: {
                "face-smile-down": "url('/svg/faces/smilefacedown.svg')",
                "face-smile": "url('/svg/faces/smileface.svg')",
                "face-click": "url('/svg/faces/clickface.svg')",
                "face-win": "url('/svg/faces/winface.svg')",
                "face-lost": "url('/svg/faces/lostface.svg')",
                "border-top-left": "url('/svg/border/topleft.svg')",
                "border-top": "url('/svg/border/top.svg')",
                "border-top-right": "url('/svg/border/topright.svg')",
                "border-left": "url('/svg/border/left.svg')",
                "border-right": "url('/svg/border/right.svg')",
                "border-middle-left": "url('/svg/border/middleleft.svg')",
                "border-middle": "url('/svg/border/middle.svg')",
                "border-middle-right": "url('/svg/border/middleright.svg')",
                "border-bottom-left": "url('/svg/border/bottomleft.svg')",
                "border-bottom": "url('/svg/border/bottom.svg')",
                "border-bottom-right": "url('/svg/border/bottomright.svg')",
                "border-bottom-counter-middle": "url('/svg/border/countermiddle.svg')",
                "border-counter-left": "url('/svg/border/counterleft.svg')",
                "border-counter-right": "url('/svg/border/counterright.svg')",
                "cell-1": "url('/svg/cells/cell1.svg')",
                "cell-2": "url('/svg/cells/cell2.svg')",
                "cell-3": "url('/svg/cells/cell3.svg')",
                "cell-4": "url('/svg/cells/cell4.svg')",
                "cell-5": "url('/svg/cells/cell5.svg')",
                "cell-6": "url('/svg/cells/cell6.svg')",
                "cell-7": "url('/svg/cells/cell7.svg')",
                "cell-8": "url('/svg/cells/cell8.svg')",
                "cell-9": "url('/svg/cells/cell9.svg')",
                "cell-up": "url('/svg/cells/cellup.svg')",
                "cell-down": "url('/svg/cells/celldown.svg')",
                "cell-flag": "url('/svg/cells/cellflag.svg')",
                "cell-mine": "url('/svg/cells/cellmine.svg')",
                "cell-false-mine": "url('/svg/cells/falsemine.svg')",
                "cell-blast": "url('/svg/cells/blast.svg')",
                "cell-flag-mine": "url('/svg/cells/flagmine.svg')",
                "counter-dash": "url('/svg/counter/counter-.svg')",
                "counter-0": "url('/svg/counter/counter0.svg')",
                "counter-1": "url('/svg/counter/counter1.svg')",
                "counter-2": "url('/svg/counter/counter2.svg')",
                "counter-3": "url('/svg/counter/counter3.svg')",
                "counter-4": "url('/svg/counter/counter4.svg')",
                "counter-5": "url('/svg/counter/counter5.svg')",
                "counter-6": "url('/svg/counter/counter6.svg')",
                "counter-7": "url('/svg/counter/counter7.svg')",
                "counter-8": "url('/svg/counter/counter8.svg')",
                "counter-9": "url('/svg/counter/counter9.svg')",
            }
        },
    },
    plugins: [],
} satisfies Config

