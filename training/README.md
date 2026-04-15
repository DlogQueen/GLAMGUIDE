# Tessi AI Training Folder

> Drop knowledge here to make Tessi smarter!

## Folder Structure

```
training/
├── knowledge/          # Facts, tips, techniques
├── tutorials/          # Step-by-step guides
├── products/           # Product reviews & recommendations
├── trends/             # Current makeup trends
└── README.md           # This file
```

## How to Add Knowledge

### 1. Quick Tips (knowledge/)
Create `.md` files with quick facts:

```markdown
# Foundation Tips

- Always match to your neck, not face
- Test in natural light
- Set with powder for oily skin
- Dewy finish for dry skin
```

### 2. Tutorials (tutorials/)
Create detailed guides:

```markdown
# Smokey Eye Tutorial

## Steps
1. Apply primer
2. Light shade all over lid
3. Medium shade in crease
4. Dark shade on outer V
5. Blend everything
6. Add liner and mascara

## Products Needed
- Eyeshadow palette
- Eyeliner
- Mascara
```

### 3. Product Database (products/)

```markdown
# Maybelline Fit Me Foundation

- Price: $8
- Coverage: Medium
- Finish: Matte/Dewy options
- Best for: Normal to oily
- Shades: 40+
```

### 4. Trends (trends/)

```markdown
# 2024 Trend: Cherry Cola Lips

Deep burgundy/plum lip with high gloss finish.
Popular on TikTok, suits all skin tones.
```

## File Format

- Use `.md` (Markdown) files
- Use clear headers (`#`, `##`)
- Bullet points for lists
- Include images if relevant (save to `training/images/`)

## Automatic Integration

Current beta status:
1. **This folder is not ingested by the running app yet.**
2. Tessi’s knowledge is currently loaded from embedded data in `src/services/tessiKnowledge.ts`.
3. Files here are safe to store for later ingestion, but they won’t change Tessi’s answers until ingestion is implemented.

Planned integration (post-beta):
1. Parse Markdown/PDFs into clean text
2. Chunk + tag content (topic, category, tone)
3. Store in Supabase (and optionally pgvector embeddings)
4. Retrieve relevant chunks during `tessiAI.chat()` for grounded answers

## Contributing

- You: Add makeup expertise
- AI: Add technical knowledge, trends, product research
- Together: Build the ultimate beauty knowledge base!

---

**Start adding files and Tessi gets smarter! ✨**
