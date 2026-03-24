{
  inputs = {
    flakelight.url = "github:nix-community/flakelight";
  };
  outputs = { flakelight, ... }:
    flakelight ./. ({ lib, ... }: {
      systems = lib.systems.flakeExposed;
      devShell = {
        packages = pkgs: [
          pkgs.go-task # task command - script runner
        ];
      };
    });
}