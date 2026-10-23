export function needsDocumentNavigation(userAgent: string, coarsePointer: boolean) {
  return coarsePointer || /MicroMessenger/i.test(userAgent);
}
