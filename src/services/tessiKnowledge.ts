'use client';

// Tessi Knowledge Base - Loads training folder content
// Makes local knowledge available for responses

interface KnowledgeEntry {
  topic: string;
  content: string;
  category: 'knowledge' | 'tutorial' | 'product' | 'trend';
  tags: string[];
}

class TessiKnowledge {
  private knowledge: KnowledgeEntry[] = [];
  private loaded = false;

  // Load all knowledge (called on app init)
  async loadKnowledge(): Promise<void> {
    if (this.loaded) return;
    
    // For now, use embedded knowledge
    // In production, this would fetch from training/ folder
    this.knowledge = this.getEmbeddedKnowledge();
    this.loaded = true;
  }

  // Search local knowledge
  search(query: string): KnowledgeEntry[] {
    const normalizedQuery = query.toLowerCase();
    return this.knowledge.filter(entry => 
      entry.topic.toLowerCase().includes(normalizedQuery) ||
      entry.content.toLowerCase().includes(normalizedQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
    );
  }

  // Get specific tip
  getTip(topic: string): string | null {
    const entry = this.knowledge.find(e => 
      e.topic.toLowerCase().includes(topic.toLowerCase())
    );
    return entry?.content || null;
  }

  // Get tutorials by category
  getTutorials(category?: string): KnowledgeEntry[] {
    if (category) {
      return this.knowledge.filter(e => 
        e.category === 'tutorial' && 
        e.tags.includes(category.toLowerCase())
      );
    }
    return this.knowledge.filter(e => e.category === 'tutorial');
  }

  // Get product recommendations
  getProducts(type?: string): KnowledgeEntry[] {
    const products = this.knowledge.filter(e => e.category === 'product');
    if (type) {
      return products.filter(p => 
        p.tags.includes(type.toLowerCase())
      );
    }
    return products;
  }

  // Get current trends
  getTrends(): KnowledgeEntry[] {
    return this.knowledge.filter(e => e.category === 'trend');
  }

  // Add knowledge at runtime (for user additions)
  addKnowledge(entry: Omit<KnowledgeEntry, 'tags'> & { tags?: string[] }): void {
    this.knowledge.push({
      ...entry,
      tags: entry.tags || []
    });
  }

  // Embedded starter knowledge
  private getEmbeddedKnowledge(): KnowledgeEntry[] {
    return [
      // FOUNDATION & BASE
      {
        topic: "Foundation Application",
        content: "Apply foundation in thin layers for natural look. Start at center of face and blend outward. Use damp beauty sponge for seamless finish.",
        category: "knowledge",
        tags: ["foundation", "base", "application", "beginner"]
      },
      {
        topic: "Foundation Matching",
        content: "Match foundation to your neck, not your face. Test in natural light. Wait 2 minutes for oxidation. The jawline test never lies.",
        category: "knowledge",
        tags: ["foundation", "matching", "undertones", "shopping"]
      },
      {
        topic: "Cakey Foundation Fix",
        content: "Less is more! Apply in thin layers with a damp sponge. Don't forget to moisturize first - dry skin drinks up foundation and looks patchy. Set with a light dusting of powder only where you get oily.",
        category: "knowledge",
        tags: ["foundation", "troubleshooting", "cakey", "fix"]
      },
      {
        topic: "Foundation Types by Skin",
        content: "Oily = matte, long-wearing formula. Dry = dewy, hydrating formula. Combo = satin finish. Sensitive = mineral/fragrance-free. Mature = lightweight, hydrating.",
        category: "knowledge",
        tags: ["foundation", "skin type", "formula", "shopping"]
      },
      
      // CONCEALER
      {
        topic: "Concealer Triangle",
        content: "Apply concealer in an upside-down triangle under eyes (point down toward nose). This brightens and lifts the entire eye area.",
        category: "knowledge",
        tags: ["concealer", "under eye", "brightening", "technique"]
      },
      {
        topic: "Concealer Shades",
        content: "Under eyes = 1-2 shades lighter than foundation. Blemishes = exact foundation match. Highlighting = 2-3 shades lighter. Contouring = 2 shades deeper.",
        category: "knowledge",
        tags: ["concealer", "color theory", "shopping", "application"]
      },
      {
        topic: "Creasing Prevention",
        content: "Use minimal product - dot don't drag. Set IMMEDIATELY with translucent powder. Use eye cream before makeup. Avoid thick formulas under eyes.",
        category: "knowledge",
        tags: ["concealer", "creasing", "troubleshooting", "technique"]
      },
      
      // EYESHADOW
      {
        topic: "Eyeshadow Basics",
        content: "Light shade = lid and brow bone. Medium shade = crease. Dark shade = outer V and lash line. Blend between each shade.",
        category: "tutorial",
        tags: ["eyeshadow", "eyes", "blending", "beginner"]
      },
      {
        topic: "Eyeshadow Order",
        content: "1. Primer (prevents creasing). 2. Transition shade (crease). 3. Lid color. 4. Outer V depth. 5. Brow highlight. 6. Inner corner pop. 7. Lower lash line.",
        category: "tutorial",
        tags: ["eyeshadow", "step by step", "order", "technique"]
      },
      {
        topic: "Eyeshadow Finishes",
        content: "Matte = flat, no shine. Best for crease/contour. Shimmer = subtle glow. Best for lid. Satin = slight sheen. Metallic = high shine. Glitter = sparkly particles (use glitter glue!).",
        category: "knowledge",
        tags: ["eyeshadow", "finishes", "textures", "shopping"]
      },
      {
        topic: "Eyeshadow for Eye Color",
        content: "Brown eyes = any color (lucky!). Blue eyes = copper, orange, warm browns. Green/hazel = purple, mauve, burgundy. All eyes = neutral browns always work.",
        category: "knowledge",
        tags: ["eyeshadow", "eye color", "color theory", "shopping"]
      },
      
      // EYELINER
      {
        topic: "Perfect Winged Liner",
        content: "1. Start at outer corner, draw toward temple. 2. Draw from inner corner along lash line. 3. Connect the two lines. 4. Fill in and perfect.",
        category: "tutorial",
        tags: ["eyeliner", "wing", "liquid liner", "technique"]
      },
      {
        topic: "Eyeliner Types",
        content: "Pencil = smudgy, easy, good for beginners. Liquid = sharp, precise, lasts longest. Gel = in-between, creamy, good for wings. Felt tip = marker-style, easiest liquid.",
        category: "knowledge",
        tags: ["eyeliner", "types", "shopping", "beginner"]
      },
      {
        topic: "Tightlining",
        content: "Apply eyeliner to upper waterline (between lashes). Makes lashes look instantly thicker. Use pencil or gel - NOT liquid near eyeball!",
        category: "knowledge",
        tags: ["eyeliner", "tightlining", "technique", "natural"]
      },
      {
        topic: "Fixing Messy Wings",
        content: "Use concealer on angled brush to sharpen edges. Or use cotton swab with makeup remover. Q-tip dipped in foundation also works to clean up!",
        category: "knowledge",
        tags: ["eyeliner", "wing", "fix", "troubleshooting"]
      },
      
      // MASCARA
      {
        topic: "Mascara Application",
        content: "Wiggle at base, sweep up. This deposits product at roots (volume) and separates tips (length). 2-3 coats max before it clumps.",
        category: "knowledge",
        tags: ["mascara", "application", "technique", "lashes"]
      },
      {
        topic: "Mascara by Type",
        content: "Lengthening = thin brush, fibers. Volumizing = thick brush, dense formula. Curling = curved brush. Waterproof = staying power but hard to remove.",
        category: "knowledge",
        tags: ["mascara", "types", "shopping", "lashes"]
      },
      {
        topic: "Mascara Clump Fix",
        content: "Use clean spoolie to separate. Or metal lash comb. Prevention: Don't let dry between coats. Pumping wand dries out formula faster.",
        category: "knowledge",
        tags: ["mascara", "clumps", "fix", "troubleshooting"]
      },
      {
        topic: "Mascara Expiration",
        content: "Replace every 3 months. Pumping introduces bacteria and air. Smells weird? Toss it immediately. Eye infections aren't worth it.",
        category: "knowledge",
        tags: ["mascara", "hygiene", "expiration", "safety"]
      },
      
      // BLUSH
      {
        topic: "Blush Placement",
        content: "Smile and apply to apples of cheeks. For lifted look, apply higher on cheekbone. Blend back toward temple, never closer to nose than pupil.",
        category: "knowledge",
        tags: ["blush", "cheeks", "contour", "placement"]
      },
      {
        topic: "Blush by Skin Tone",
        content: "Fair = light pinks, peaches. Medium = roses, mauves, warm pinks. Deep = berries, plums, bright oranges. Universal = peach and rose.",
        category: "knowledge",
        tags: ["blush", "skin tone", "color", "shopping"]
      },
      {
        topic: "Cream vs Powder Blush",
        content: "Cream = dewy, natural, good for dry skin. Apply with fingers or sponge. Powder = matte, buildable, good for oily skin. Apply with brush.",
        category: "knowledge",
        tags: ["blush", "formula", "cream", "powder"]
      },
      
      // LIPS
      {
        topic: "Lip Prep",
        content: "Exfoliate lips weekly. Apply lip balm before makeup. Use lip liner to define shape. Apply lipstick, blot, apply second layer for longevity.",
        category: "knowledge",
        tags: ["lips", "lipstick", "prep", "long lasting"]
      },
      {
        topic: "Lipstick Longevity",
        content: "Line entire lip with liner. Apply lipstick. Blot with tissue. Apply second layer. Set with translucent powder through tissue. Gloss only in center.",
        category: "tutorial",
        tags: ["lips", "lipstick", "long lasting", "technique"]
      },
      {
        topic: "Lip Colors by Undertone",
        content: "Cool undertones = blue-reds, berries, mauves. Warm undertones = orange-reds, corals, warm nudes. Neutral = everything looks good!",
        category: "knowledge",
        tags: ["lips", "undertone", "color theory", "shopping"]
      },
      {
        topic: "Overlining Lips",
        content: "Line just OUTSIDE natural line, not far above. Use concealer to sharpen edges. Matte formulas hide the line best. Don't overline bottom too much.",
        category: "knowledge",
        tags: ["lips", "overlining", "lip liner", "technique"]
      },
      
      // CONTOUR & HIGHLIGHT
      {
        topic: "Contouring for Beginners",
        content: "Use matte bronzer 2 shades darker. Suck in cheeks, apply to hollows. Apply to forehead hairline and jawline. Blend UP for lifting effect.",
        category: "tutorial",
        tags: ["contour", "bronzer", "beginner", "sculpting"]
      },
      {
        topic: "Highlighter Placement",
        content: "Top of cheekbones. Bridge of nose (not tip). Cupid's bow. Inner corner of eyes. Brow bone. Collarbone. Center of forehead and chin for glowy look.",
        category: "knowledge",
        tags: ["highlight", "strobing", "placement", "glow"]
      },
      {
        topic: "Cream vs Powder Contour",
        content: "Cream = natural, blendable, good for dry/normal skin. Use before powder. Powder = precise, buildable, good for oily skin. Use after setting powder.",
        category: "knowledge",
        tags: ["contour", "formula", "cream", "powder"]
      },
      
      // EYEBROWS
      {
        topic: "Brow Shape Guide",
        content: "Start: inner corner aligned with nose edge. Arch: aligned with outer iris. End: angled from nose through outer eye corner. Follow natural brow bone.",
        category: "knowledge",
        tags: ["eyebrows", "brows", "shape", "mapping"]
      },
      {
        topic: "Filling Eyebrows",
        content: "Use light, feathery strokes to mimic hairs. Fill sparse areas. Concentrate color at tail. Use spoolie to blend front for gradient effect. Set with gel.",
        category: "tutorial",
        tags: ["eyebrows", "brows", "filling", "technique"]
      },
      {
        topic: "Brow Products",
        content: "Pencil = precise, hair-like strokes. Pomade = bold, long-lasting. Powder = soft, natural. Gel = sets brows, adds tint. Pen = microblading effect.",
        category: "knowledge",
        tags: ["eyebrows", "brows", "products", "shopping"]
      },
      {
        topic: "Soap Brows",
        content: "Spray spoolie with setting spray. Rub on clear bar soap. Brush brows UP for fluffy, laminated look. Sets all day and looks full!",
        category: "tutorial",
        tags: ["eyebrows", "brows", "soap brows", "trend"]
      },
      
      // SKINCARE & PREP
      {
        topic: "Skincare Before Makeup",
        content: "Always start with clean, moisturized skin. Wait 5 min after moisturizer. SPF is non-negotiable. Primer creates smooth canvas.",
        category: "knowledge",
        tags: ["skincare", "prep", "spf", "base"]
      },
      {
        topic: "Primer Types",
        content: "Silicone = pore-filling, smoothing. Hydrating = for dry skin. Mattifying = for oily skin. Color-correcting = peach (dark circles), green (redness).",
        category: "knowledge",
        tags: ["primer", "prep", "types", "shopping"]
      },
      {
        topic: "Oily Skin Control",
        content: "Use mattifying primer. Set foundation with powder. Use setting spray. Blotting papers throughout day. Avoid dewy products on T-zone.",
        category: "knowledge",
        tags: ["skin type", "oily", "control", "long lasting"]
      },
      {
        topic: "Dry Skin Hydration",
        content: "Heavy moisturizer before makeup. Hydrating primer. Dewy foundation. Cream products over powder. Setting spray to meld layers together.",
        category: "knowledge",
        tags: ["skin type", "dry", "hydration", "dewy"]
      },
      
      // TOOLS & BRUSHES
      {
        topic: "Brush Cleaning",
        content: "Spot clean daily with spray. Deep clean weekly with gentle shampoo. Lay flat to dry. Never stand upright (water damages glue).",
        category: "knowledge",
        tags: ["brushes", "cleaning", "maintenance", "hygiene"]
      },
      {
        topic: "Essential Brushes",
        content: "You only need 5: Foundation/blending brush. Fluffy crease brush. Flat shader for lid. Small detail brush. Blush/bronzer brush. Done!",
        category: "knowledge",
        tags: ["brushes", "essentials", "beginner", "shopping"]
      },
      {
        topic: "Beauty Sponge Use",
        content: "Use DAMP, not wet. Squeeze out excess water. Bounce, don't drag. Good for foundation, concealer, cream contour, setting powder.",
        category: "knowledge",
        tags: ["sponge", "beauty blender", "application", "technique"]
      },
      
      // TECHNIQUES
      {
        topic: "Color Correction Guide",
        content: "Green = redness/pimples. Peach/orange = dark circles (medium-dark skin). Purple = sallowness/yellow tones. Yellow = purple bruises/veins.",
        category: "knowledge",
        tags: ["color correct", "concealer", "theory", "technique"]
      },
      {
        topic: "Setting Spray Technique",
        content: "Hold 8-10 inches away. Mist in X pattern (corner to corner). Then T pattern (forehead to chin). Let dry naturally, don't fan.",
        category: "knowledge",
        tags: ["setting spray", "longevity", "technique", "finishing"]
      },
      {
        topic: "Baking Technique",
        content: "Apply heavy layer of loose powder to areas you want brightened (under eyes, chin, forehead). Let sit for 5-10 minutes. Brush off excess. Lasts ALL day.",
        category: "tutorial",
        tags: ["baking", "powder", "technique", "long lasting"]
      },
      {
        topic: "Layering Products",
        content: "Thin layers = natural, lasting. Cream before powder. Let each layer dry slightly. Don't mix textures (cream over powder = patchy).",
        category: "knowledge",
        tags: ["technique", "layering", "order", "application"]
      },
      
      // TRENDS
      {
        topic: "Clean Girl Makeup",
        content: "2024 trend: Glossy skin, fluffy brows, minimal eye makeup, tinted lips. Focus on skincare base. Dewy finishing spray essential.",
        category: "trend",
        tags: ["2024", "trend", "clean girl", "minimal", "dewy"]
      },
      {
        topic: "Cherry Cola Lips",
        content: "Deep burgundy/plum lip color with high-shine gloss finish. Popular on TikTok. Looks good on all skin tones. Pair with minimal eye makeup.",
        category: "trend",
        tags: ["2024", "trend", "lips", "cherry cola", "viral"]
      },
      {
        topic: "Latte Makeup",
        content: "Warm brown monochromatic look. Bronze lids, sculpted cheeks, nude-brown lips. Suits everyone. Very 2024.",
        category: "trend",
        tags: ["2024", "trend", "latte", "brown", "monochrome"]
      },
      {
        topic: "Glazed Donut Skin",
        content: "All-over glow from skincare, not makeup. Glass skin effect. Highlighter on high points. Dewy setting spray mandatory.",
        category: "trend",
        tags: ["2024", "trend", "glazed", "glow", "skincare"]
      },
      {
        topic: "Bold Blush Trend",
        content: "Heavy blush across cheeks AND nose. Sun-kissed, sunburned look. Draping technique. Often paired with minimal other makeup.",
        category: "trend",
        tags: ["2024", "trend", "blush", "draping", "viral"]
      },
      
      // PRODUCTS - DRUGSTORE
      {
        topic: "e.l.f. Holy Grail Products",
        content: "Best e.l.f. products: Poreless Putty Primer ($10), Camo Concealer ($6), Bite-Size Eyeshadows ($3), Halo Glow Liquid Filter ($14). Drugstore prices, quality performance.",
        category: "product",
        tags: ["drugstore", "budget", "e.l.f.", "affordable"]
      },
      {
        topic: "Maybelline Mascara Guide",
        content: "Sky High = length and volume. Lash Sensational = curl and fan effect. Colossal = dramatic volume. Great Lash = classic, natural.",
        category: "product",
        tags: ["drugstore", "maybelline", "mascara", "affordable"]
      },
      {
        topic: "NYX Butter Gloss",
        content: "$5 each, non-sticky, pigmented, comfy. Tiramisu = universal nude. Creme Brulee = pinky nude. Best drugstore gloss hands down.",
        category: "product",
        tags: ["drugstore", "nyx", "lips", "gloss", "affordable"]
      },
      {
        topic: "Milani Baked Blush",
        content: "$9, baked formula, luminous finish. Luminoso = peachy-pink universal shade. Rose D'oro = rose gold. Lasts forever, applies like high-end.",
        category: "product",
        tags: ["drugstore", "milani", "blush", "affordable"]
      },
      {
        topic: "Real Techniques Brushes",
        content: "Quality synthetic brushes that wash well. Miracle Complexion Sponge ($6) rivals $20 sponges. Starter Set ($18) has everything you need.",
        category: "product",
        tags: ["drugstore", "real techniques", "brushes", "affordable"]
      },
      {
        topic: "Essence Lash Princess",
        content: "$5 mascara that beats $30 ones. Dramatic volume, stays all day. Green tube = original, purple = waterproof, pink = curl.",
        category: "product",
        tags: ["drugstore", "essence", "mascara", "budget"]
      },
      
      // BEGINNER GUIDES
      {
        topic: "First Makeup Kit",
        content: "Start with: tinted moisturizer, concealer, mascara, cream blush, lip tint. Total cost: under $50 at drugstore. Master basics before buying more.",
        category: "knowledge",
        tags: ["beginner", "starter kit", "essentials", "shopping"]
      },
      {
        topic: "5 Minute Makeup",
        content: "1. Tinted moisturizer. 2. Concealer where needed. 3. Cream blush on cheeks AND lips. 4. Mascara. 5. Done! Optional: brow gel.",
        category: "tutorial",
        tags: ["beginner", "quick", "everyday", "routine"]
      },
      {
        topic: "Makeup Order",
        content: "Skincare → Primer → Color correct → Foundation → Concealer → Cream products → Set with powder → Powder products → Setting spray. Always cream before powder!",
        category: "knowledge",
        tags: ["beginner", "order", "routine", "step by step"]
      },
      
      // TROUBLESHOOTING
      {
        topic: "Makeup Separating",
        content: "Usually skincare/makeup incompatibility. Let moisturizer absorb fully before foundation. Don't mix silicone and water-based products. Exfoliate dead skin.",
        category: "knowledge",
        tags: ["troubleshooting", "separating", "patchy", "fix"]
      },
      {
        topic: "Foundation Oxidation",
        content: "Foundation turns darker after application. Test and wait 5 min before buying. Use shade lighter. Mix with white mixer if needed.",
        category: "knowledge",
        tags: ["foundation", "oxidation", "troubleshooting", "fix"]
      },
      {
        topic: "Eyeshadow Fallout",
        content: "Tap excess off brush. Do eyes before face makeup. Use shadow shield or tape. Press pigment on, don't sweep. Use glitter glue for shimmers.",
        category: "knowledge",
        tags: ["eyeshadow", "fallout", "troubleshooting", "fix"]
      },
      
      // ADVANCED
      {
        topic: "Cut Crease Tutorial",
        content: "1. Apply transition shade. 2. Pack concealer on lid where you want cut. 3. Set with powder. 4. Apply lid shade on top. Sharp, defined look!",
        category: "tutorial",
        tags: ["advanced", "cut crease", "eyeshadow", "technique"]
      },
      {
        topic: "Smokey Eye Steps",
        content: "1. Dark shade on outer V and lower lash line. 2. Medium shade in crease, blend toward inner eye. 3. Light shimmer on inner corner. 4. Blend everything together. 5. Liner and mascara.",
        category: "tutorial",
        tags: ["smokey eye", "eyeshadow", "evening", "technique"]
      },
      
      // HYGIENE & SAFETY
      {
        topic: "Makeup Expiration",
        content: "Mascara: 3 months. Liquid liner: 6 months. Foundation: 12 months. Powder products: 2 years. Lipsticks: 1-2 years. When in doubt, throw it out. Eye infections aren't cute.",
        category: "knowledge",
        tags: ["hygiene", "expiration", "safety", "clean"]
      },
      {
        topic: "Sharing Makeup",
        content: "DON'T share eye products (mascara, liner). Lipstick - wipe off top layer first. Powders = safer to share. Brushes - clean between users. When sick, toss lip/eye products used while ill.",
        category: "knowledge",
        tags: ["hygiene", "sharing", "safety", "health"]
      },
      
      // REMOVAL
      {
        topic: "Makeup Removal",
        content: "Micellar water for light makeup. Cleansing balm/oil for heavy/waterproof. Double cleanse: oil then foam cleanser. Never sleep with makeup on - your skin will hate you.",
        category: "knowledge",
        tags: ["skincare", "removal", "cleansing", "routine"]
      },
      {
        topic: "Waterproof Mascara Removal",
        content: "Hold soaked cotton pad on eyes for 30 sec (don't rub!). Use oil-based remover. Vaseline works in a pinch. Be gentle - eyes are delicate!",
        category: "knowledge",
        tags: ["removal", "waterproof", "mascara", "gentle"]
      }
    ];
  }
}

export const tessiKnowledge = new TessiKnowledge();
export default tessiKnowledge;
