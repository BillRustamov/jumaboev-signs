export {
  CANVAS_HEIGHT_IN,
  CANVAS_WIDTH_IN,
  DESIGN_VERSION,
  TEMPLATES,
  PRIMARY_TEMPLATES,
  MORE_TEMPLATES,
  classifyLogo,
  isSignFontId,
  isTemplateId,
  type DesignDocument,
  type ProductionMode,
  type SignFontId,
  type TemplateId,
} from "@/lib/design/schema";
export { compileDesign, templatesDiffer } from "@/lib/design/compile";
export { contentOccupancy, TEMPLATE_LAYOUT, REGULATORY } from "@/lib/design/layout";
export { fontClass, fontFamily } from "@/lib/design/typography";
export { logoScaleFromSize, containLogo } from "@/lib/design/logo";
export {
  formatPlace,
  migrateCityState,
  parsePlace,
  resolveFont,
  resolvePlace,
  resolveTemplate,
} from "@/lib/design/migrate";
