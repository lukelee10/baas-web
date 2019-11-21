/**
 * Guard used to prevent reimporting of CoreModule, (ref Style 04-12
 * in style guide).
 *
 * @param parentModule is the calling module
 * @param moduleName is the name of the module being loaded
 */
export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
      throw new Error(`${moduleName} has already been loaded. Import ${moduleName} modules in the AppModule only.`);
  }
}
