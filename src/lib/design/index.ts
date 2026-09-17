export {
  CANVAS_HEIGHT_IN,
  CANVAS_WIDTH_IN,
  DESIGN_VERSION,
  TEMPLATES,
  classifyLogo,
  isSignFontId,
  isTemplateId,
  type DesignDocument,
  type SignFontId,
  type TemplateId,
} from "@/lib/design/schema";
export { compileDesign, templatesDiffer } from "@/lib/design/compile";
export { fontClass, fontFamily } from "@/lib/design/typography";
export { logoScaleFromSize } from "@/lib/design/logo";
export {
  formatPlace,
  migrateCityState,
  parsePlace,
  resolveFont,
  resolvePlace,
  resolveTemplate,
} from "@/lib/design/migrate";
