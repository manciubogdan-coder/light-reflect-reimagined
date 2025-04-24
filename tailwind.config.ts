
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
                // Light Reflect brand colors
                'electric-blue': '#0077FF',
                'electric-blue-dark': '#0055CC',
                'electric-blue-light': '#33AAFF',
                'neon-red': '#ea384c',
                'neon-red-light': '#FF5A6E',
                'dark-matter': '#121212',
                'circuit-blue': '#1E3A8A',
                'hologram-blue': '#00FFFF',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                'pulse-glow': {
                    '0%, 100%': { 
                        boxShadow: '0 0 5px rgba(0, 119, 255, 0.5), 0 0 20px rgba(0, 119, 255, 0.3)'
                    },
                    '50%': {
                        boxShadow: '0 0 15px rgba(0, 119, 255, 0.8), 0 0 30px rgba(0, 119, 255, 0.5)'
                    }
                },
                'circuit-flow': {
                    '0%': { backgroundPosition: '0% 0%' },
                    '100%': { backgroundPosition: '200% 0%' }
                },
                'flicker': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' }
                },
                'scale-in': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                },
                'neon-pulse': {
                    '0%, 100%': { 
                        textShadow: '0 0 5px rgba(234, 56, 76, 0.7), 0 0 10px rgba(234, 56, 76, 0.5)'
                    },
                    '50%': {
                        textShadow: '0 0 15px rgba(234, 56, 76, 1), 0 0 20px rgba(234, 56, 76, 0.8)'
                    }
                },
                'holographic-shine': {
                    '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                    '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' }
                },
                'glitch': {
                    '0%': { transform: 'translate(0)' },
                    '20%': { transform: 'translate(-2px, 2px)' },
                    '40%': { transform: 'translate(-2px, -2px)' },
                    '60%': { transform: 'translate(2px, 2px)' },
                    '80%': { transform: 'translate(2px, -2px)' },
                    '100%': { transform: 'translate(0)' }
                },
                'spin-slow': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                },
                'scanHorizontal': {
                    '0%': { top: '-10px' },
                    '50%': { top: '100%' },
                    '50.1%': { top: '100%' },
                    '100%': { top: '-10px' }
                },
                'scanVertical': {
                    '0%': { left: '-10px' },
                    '50%': { left: '100%' },
                    '50.1%': { left: '100%' },
                    '100%': { left: '-10px' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s infinite',
                'circuit-flow': 'circuit-flow 8s linear infinite',
                'flicker': 'flicker 0.3s ease-in-out infinite',
                'scale-in': 'scale-in 0.3s ease-out',
                'neon-pulse': 'neon-pulse 2s infinite',
                'holographic-shine': 'holographic-shine 10s linear infinite',
                'glitch': 'glitch 0.5s infinite',
                'spin-slow': 'spin-slow 15s linear infinite',
                'scanHorizontal': 'scanHorizontal 8s linear infinite',
                'scanVertical': 'scanVertical 12s linear infinite'
			},
            backgroundImage: {
                'circuit-pattern': "url('/src/assets/circuit-background.png')",
                'grid-lines': 'linear-gradient(to right, rgba(30, 58, 138, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 58, 138, 0.1) 1px, transparent 1px)'
            },
            fontFamily: {
                'tech': ['Orbitron', 'Audiowide', 'sans-serif'],
                'future': ['Rajdhani', 'Exo', 'sans-serif']
            }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
