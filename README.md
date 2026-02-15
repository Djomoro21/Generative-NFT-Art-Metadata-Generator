# Modern NFT Art Generator

A professional, high-performance generative art engine built with **Next.js 15**. It enables creators to transform layered artwork into large-scale NFT collections with ease, complete with weighted rarities, incompatible trait rules, and seamless IPFS deployment.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Key Features

- **Intuitive Multi-Step Workflow**: A polished 4-step process from setup to export.
- **Weighted Rarity System**: Fine-tune the appearance frequency of every trait in your collection.
- **Dynamic Layer Management**: Drag-and-drop layer reordering with real-time canvas preview.
- **Incompatible Trait Rules**: Define logic to prevent specific traits from ever appearing together.
- **Batch Metadata Generation**: Automatic generation of ERC-721/ERC-1155 compatible metadata.
- **IPFS Integration**: One-click upload to Pinata for decentralized storage of images and metadata.
- **Soulbound Support**: Toggle metadata flags for non-transferable token collections.
- **Premium Design**: Sleek, responsive UI featuring glassmorphism and modern aesthetics.

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks & Custom `useNFTGenerator` Hook
- **Asset Processing**: [JSZip](https://stuk.github.io/jszip/) & Canvas API
- **Styling**: Vanilla CSS with modern Design Tokens

---

## Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- npm / yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/aesthetix-nft-generator.git
   cd aesthetix-nft-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage Guide

### 1. Collection Setup
Provide your collection name, description, and target size. Upload a folder containing your art layers (organized into subfolders, e.g., `Background`, `Body`, `Eyes`).

### 2. Configure Layers
Drag layers to set their render order (top of list = rendered last/on top). Adjust the "Weight" for each trait to control rarity. Add "Incompatible Rules" to ensure your traits never clash.

### 3. Review Collection
Build a live preview of your entire collection. Regenerate combinations until you are satisfied with the distribution and variety.

### 4. Export & Upload
- **Download ZIP**: Batch renders all images and metadata into a single organized ZIP file.
- **IPFS Upload**: Enter your Pinata JWT to upload your entire collection directly to the decentralized web. Receive your Images CID and Metadata Base URI instantly.

---

## Project Structure

```text
src/
├── app/              # Next.js App Router & Global Styles
├── components/       # Modular UI Step Components
├── hooks/            # Core Generation Engine (useNFTGenerator)
├── utils/            # IPFS and Canvas helpers
└── types/            # TypeScript Interface Definitions
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ✨ by [Your Name/Handle]
