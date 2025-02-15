This repository is deprecated, please refer to [SlimSuite](https://github.com/artsakenos/artsakenos.github.io/tree/master/slim_suite).
---

# SlimJEC - Slim Javascript Elasticsearch Client

A lightweight, pure Javascript client for basic Elasticsearch operations. No frameworks, Node.js, or Python required - just your browser.

## Overview

SlimJEC provides a simple way to interact with Elasticsearch instances directly from your browser. It's perfect for creating static pages with dynamic search capabilities.

## Components

The project consists of:
- **SlimJEC.js**: Core client functionality
- **SlimJEC_Config.js**: Optional configuration file for credentials
- **SlimJEC.html**: Static HTML wrapper
- **SlimJEC.css**: Styling for the HTML interface

## Features

- **Search Capabilities**
  - Full-text search with match and fuzzy modes
  - Field-specific key:value searching
  - Index information retrieval
- **Document Management**
  - Post new documents to your index
- **Use Case Example**
  - Transform static pages into dynamic blogs by combining SlimJEC with Elasticsearch

## Demo

Check out the live demo at: [SlimJEC Demo](https://artsakenos.github.io/slim_suite/SlimJEC.html)

## Known Issues and Limitations

1. This is an experimental project - testing has been limited
2. Trailing '/' in URLs needs manual removal
3. Cross-Origin Resource Sharing (CORS) requires browser configuration
4. HTTP Elasticsearch instances on HTTPS websites require additional setup

## Contributing

This project welcomes contributions! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests
- Help with testing and documentation

## Getting Started

[Add installation and basic usage instructions here]

---
**Note**: This is a lightweight client designed for basic Elasticsearch operations. For more complex use cases, consider using official Elasticsearch clients.
