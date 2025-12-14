{
  description = "Sky Games Go";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  outputs = { self,nixpkgs }@inputs:
  let
  system = "x86_64-linux";
  specialArgs = {inherit self inputs;};
  lib = nixpkgs.lib;
  pkgs = import nixpkgs { inherit system; };
  in {
    defaultPackage.${system} = pkgs.buildNpmPackage {
     name = "sky-games-go";
     src = ./.;
     npmDepsHash = "sha256-x3VJw3x9B8keLbCAH9aH5i208TxclmnxElkU1I7zlMw=";
    #  dontNpmBuild = true;
	preBuild = ''
	npx update-browserslist-db@latest
	'';
    };
  };
}
