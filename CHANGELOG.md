# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial Astro implementation
- Core/user directory separation for updateable architecture
- Content Collections with type-safe schemas
- DataTable component with sorting and filtering
- Search component with pagination
- Directus integration with custom loader
- Base layouts with customization slots
- Comprehensive documentation and migration guide
- TypeScript support throughout
- Path aliases for clean imports

### Components (Initial Release)
- ✅ DataTable - Sortable, filterable tables from any data source
- ✅ Search - Full-text search with custom result templates
- ✅ BaseLayout - Main site layout with header, navigation, footer
- 🚧 MapLeaflet - Interactive maps (placeholder, needs Leaflet integration)
- 🚧 VectorLayer - Map vector layers (placeholder)
- 🚧 Gallery - Image galleries (placeholder, needs PhotoSwipe)
- 🚧 Record - Single record display (partial implementation)
- 🚧 Field - Field value display (placeholder)

### Documentation
- Complete README with setup instructions
- Migration guide from Gatsby to Astro
- Quick start tutorial
- Directus integration guide
- Component documentation
- Contributing guidelines

## [2.0.0-alpha] - 2026-01-13

### Changed
- **BREAKING**: Migration from Gatsby to Astro
- **BREAKING**: GraphQL replaced with Content Collections
- **BREAKING**: React components converted to Astro components
- **BREAKING**: New project structure with core/user separation

### Migration Notes
- See [MIGRATION.md](MIGRATION.md) for detailed migration instructions
- Old Gatsby sites need to be rebuilt using new structure
- Content files can be migrated with minimal changes to frontmatter
- Components need to be adapted to Astro syntax

## [1.x] - Gatsby Version

Previous versions used Gatsby framework. See the [legacy branch](https://github.com/lad-sapienza/scms/tree/gatsby) for Gatsby-based releases.

---

## Version History

### Version 2.x - Astro Edition
- Modern, performant static site generator
- Zero JavaScript by default
- Type-safe content management
- Updateable core architecture

### Version 1.x - Gatsby Edition (Legacy)
- React-based static site generator
- GraphQL data layer
- Original s:CMS implementation

---

## Legend
- ✅ Fully implemented
- 🚧 Partial implementation or placeholder
- 🔄 In progress
- 📝 Planned
- ❌ Deprecated

---

For more information about releases, see the [GitHub Releases](https://github.com/lad-sapienza/scms-astro/releases) page.
