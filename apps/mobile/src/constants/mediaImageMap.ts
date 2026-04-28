import { ImageSourcePropType } from 'react-native';

const PLACEHOLDER = require('@assets/images/Placeholders/ImagePlaceholder.png');

// Keys must match exactly the `image_path` values stored in the DB seed.
// Verified against: apps/backend/prisma/seed.ts  ↔  assets/images/
const IMAGE_MAP: Record<string, ImageSourcePropType> = {
  // ── LIVROS ─────────────────────────────────────────────────────────────────
  'books/alem_da_cura.jpg':           require('@assets/images/Books/alem_da_cura.jpg'),
  'books/guia_enfrentar.jpg':         require('@assets/images/Books/guia_enfrentar.jpg'),
  'books/ressignificando_vida.jpg':   require('@assets/images/Books/ressignificando_vida.jpg'),
  'books/mergulhando_passado.jpg':    require('@assets/images/Books/mergulhando_passado.jpg'),
  'books/sobrevivi.jpg':              require('@assets/images/Books/sobrevivi.jpg'),
  'books/novo_amanhecer.jpg':         require('@assets/images/Books/novo_amanhecer.jpg'),
  'books/cura_definitiva.jpg':        require('@assets/images/Books/cura_definitiva.jpg'),
  'books/208_dias.jpg':               require('@assets/images/Books/208_dias.jpg'),

  // ── FILMES ─────────────────────────────────────────────────────────────────
  'movies/love_story.png':            require('@assets/images/Movies/love_story.png'),
  'movies/lacos_ternura.jpg':         require('@assets/images/Movies/lacos_ternura.jpg'),
  'movies/tudo_por_amor.jpg':         require('@assets/images/Movies/tudo_por_amor.jpg'),
  'movies/golpe_destino.jpg':         require('@assets/images/Movies/golpe_destino.jpg'),
  'movies/lado_a_lado.jpg':           require('@assets/images/Movies/lado_a_lado.jpg'),
  'movies/patch_adams.jpg':           require('@assets/images/Movies/patch_adams.jpg'),
  'movies/amor_verdadeiro.jpg':       require('@assets/images/Movies/amor_verdadeiro.jpg'),
  'movies/amor_recordar.jpg':         require('@assets/images/Movies/amor_recordar.jpg'),
  'movies/antes_de_partir.jpg':       require('@assets/images/Movies/antes_de_partir.jpg'),
  'movies/chance_viver.jpg':          require('@assets/images/Movies/chance_viver.jpg'),
  'movies/prova_amor.jpg':            require('@assets/images/Movies/prova_amor.jpg'),
  'movies/biutiful.jpg':              require('@assets/images/Movies/biutiful.jpg'),
  'movies/cartas_deus.jpg':           require('@assets/images/Movies/cartas_deus.jpg'),

  // ── SÉRIES ─────────────────────────────────────────────────────────────────
  'series/alexa_katie.jpg':           require('@assets/images/Series/alexa_katie.jpg'),
  'series/the_big_c.jpg':             require('@assets/images/Series/the_big_c.jpg'),
  'series/recomeco.jpg':              require('@assets/images/Series/recomeco.jpg'),
  'series/graca_coragem.jpg':         require('@assets/images/Series/graca_coragem.jpg'),
  'series/patricia_figueiredo.png':   require('@assets/images/Series/patricia_figueiredo.png'),
  'series/hospital_amor.png':         require('@assets/images/Series/hospital_amor.png'),

  // ── ATIVIDADES ─────────────────────────────────────────────────────────────
  'activities/yoga.jpg':             require('@assets/images/Placeholders/Mocks/yoga.jpg'),
  'activities/jardinagem.jpg':       require('@assets/images/Placeholders/Mocks/jardinagem.jpg'),
  'activities/pintura.jpg':          require('@assets/images/Placeholders/Mocks/pintura.jpg'),
  'activities/diario.jpg':           require('@assets/images/Placeholders/Mocks/diario.jpg'),
  'activities/meditacao-guiada.jpg': require('@assets/images/Placeholders/Mocks/meditacao-guiada.jpg'),
};

export function getMediaImage(imagePath?: string | null): ImageSourcePropType {
  const key = imagePath?.trim();
  if (key && IMAGE_MAP[key]) return IMAGE_MAP[key];
  return PLACEHOLDER;
}
