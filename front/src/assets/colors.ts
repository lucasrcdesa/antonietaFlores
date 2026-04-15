// Paleta de Cores - Floricultura
export const colors = {
  // Cores Principais (Bege/Marrom)
  primary: {
    begeBase: '#E8D8C8',        // Bege base (background)
    begeRosé: '#DCC5B4',        // Bege rosé suave
    nudeMiddle: '#CBB2A1',      // Nude médio (cards / seções)
    brownLight: '#A78F7E',      // Marrom claro elegante
    brownDark: '#6E5A4E',       // Marrom escuro (texto principal)
  },

  // Cores de Apoio
  support: {
    offWhiteWarm: '#F7F2ED',    // Off-white quente (fundo leve)
    white: '#FFFFFF',           // Branco suave (contraste)
    grayWarm: '#9A8F86',        // Cinza quente (texto secundário)
  },
};

// Aliases para uso mais direto
export const COLORS = {
  background: colors.primary.begeBase,
  cardBg: colors.primary.nudeMiddle,
  textPrimary: colors.primary.brownDark,
  textSecondary: colors.support.grayWarm,
  lightBg: colors.support.offWhiteWarm,
  white: colors.support.white,
  accentLight: colors.primary.brownLight,
  accentRosé: colors.primary.begeRosé,
};
