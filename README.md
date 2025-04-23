# AttackSecurity - Password Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Go Report Card](https://goreportcard.com/badge/github.com/yourusername/attacksecurity)](https://goreportcard.com/report/github.com/yourusername/attacksecurity)
[![Wails](https://img.shields.io/badge/Wails-v2.0+-blue.svg)](https://wails.io)

A robust desktop application for password management built with Wails (Go + Next.js), featuring advanced security analysis, validation, and transformation capabilities.

![image](https://github.com/user-attachments/assets/959c6d22-a6de-419e-b23d-d5b99d6ca82a)

## Features

### 🔒 Password Validation
- Strength scoring system (0-100)
- Common password pattern detection
- Breach database verification (HaveIBeenPwned integration)
- Complexity requirements:
  - Minimum length enforcement
  - Character diversity checks
  - Consecutive character detection

### 🛠 Password Modification
- Automatic complexity enhancement
- Pattern-based transformations
- Secure password generation:
  - Cryptographic randomness
  - Customizable character sets
  - Pronounceable password options
- Format conversion tools

### 🔍 Password Analysis
- Character frequency visualization
- Pattern recognition engine
- Entropy calculation
- Common substitution detection (e.g., '@' for 'a')

### 🧠 Smart Filter
- Rule-based password categorization
- Custom filter creation interface
- Bulk processing capabilities
- Export/import filtering profiles

## Technologies

### Frontend
- **Next.js**
- TypeScript
- Tailwind CSS

### Backend
- **Golang**
- Wails framework


## Installation

### Prerequisites
- Go 1.21+
- Node.js 18+
- npm 9+
- Wails v2 CLI
- GCC/mingw (for native builds)

```bash
# Clone repository
git clone https://github.com/yourusername/attacksecurity.git
cd attacksecurity

# Install frontend dependencies
cd frontend
npm install

# Install Wails CLI
go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Build application
cd ..
wails build
```

## Usage

```bash
# Development mode
wails dev

# Production build
wails build -clean -platform [windows/linux/darwin]

# Cross-compilation
wails build -platform windows -nsis
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

- @github.com/kkmihai (WebUI Development)
- Wails framework team
- Next.js community
- Go language developers
- OWASP Password Guidelines
