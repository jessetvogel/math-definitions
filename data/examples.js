const examples = [
  "AA:semiring",
  "AA:lie-algebra",
  "AA:cartan-subalgebra",
  "AG:separated",
  "AG:proper-morphism",
  "AG:smooth-morphism",
  "AG:formally-smooth",
  "AG:formally-unramified",
  "AG:flat-morphism",
  "AG:complete-intersection",
  "AG:fppf-covering",
  "AG:fpqc-covering",
  "AG:birational-map",
  "AG:galois-cover",
  "AG:group-scheme",
  "AG:algebraic-group",
  "AG:reductive-algebraic-group",
  "AG:severi-brauer-variety",
  "AG:algebraic-torus",
  "AG:borel-subgroup",
  "AG:toric-variety",
  "AG:ample-invertible-sheaf",
  "AG:cech-cohomology",
  "AG:flag-variety",
  "AG:slope-vector-bundle",
  "AG:geometric-quotient",
  "AG:affine-git-quotient",
  "AG:log-scheme",
  "AG:log-differentials",
  "AT:deformation-retract",
  "AT:seifert-van-kampen-theorem",
  "AT:hurewicz-fibration",
  "AT:serre-fibration",
  "AT:eilenberg-maclane-space",
  "AT:cw-complex",
  "AT:loop-space",
  "AT:homotopy-fiber",
  "AT:spectrum",
  "CA:unit",
  "CA:nilpotent-element",
  "CA:reduced-ring",
  "CA:idempotent-element",
  "CA:noetherian-ring",
  "CA:localization",
  "CA:regular-ring",
  "CA:field-of-fractions",
  "CA:discrete-valuation-ring",
  "CA:regular-sequence",
  "CA:hilbert-series",
  "CA:hilbert-polynomial",
  "CA:standard-smooth",
  "CA:fitting-ideal",
  "CA:graded-ring",
  "CA:morita-equivalence",
  "CA:homogeneous-ideal",
  "CA:irrelevant-ideal",
  "CA:algebra",
  "CA:derivation",
  "CA:completion",
  "CA:azumaya-algebra",
  "CA:simple-ring",
  "CA:central-simple-algebra",
  "CA:involutive-ring",
  "CA:involutive-algebra",
  "CA:hochschild-cohomology",
  "CA:division-ring",
  "CA:frobenius-morphism",
  "CA:splitting-field",
  "CA:perfect-field",
  "CA:normal-field-extension",
  "CA:algebraically-closed-field",
  "CA:projective-module",
  "CA:flat-module",
  "CA:bimodule",
  "CT:monoidal-category",
  "CT:symmetric-monoidal-category",
  "CT:enriched-category",
  "CT:simplicial-object",
  "CT:infinity-category",
  "CT:localization",
  "CT:limit",
  "CT:fiber",
  "CT:comma-category",
  "CT:inverse-limit",
  "CT:direct-limit",
  "CT:galois-category",
  "CT:category-fibered-in-groupoids",
  "DG:exterior-derivative",
  "DG:lie-derivative",
  "DG:whitney-embedding-theorem",
  "DG:parallel-transport",
  "DG:distribution",
  "DG:involutive-distribution",
  "DG:geodesic",
  "DG:exponential-map",
  "DG:bordism",
  "DG:lie-algebroid",
  "DG:volume-form",
  "DG:symplectic-manifold",
  "DG:tautological-one-form",
  "DG:canonical-symplectic-form",
  "DG:symplectic-vector-field",
  "DG:hamiltonian-vector-field",
  "DG:poisson-manifold",
  "FA:norm",
  "FA:equivalent-norms",
  "FA:c-star-algebra",
  "GT:normal-subgroup",
  "GT:solvable-group",
  "GT:dihedral-group",
  "GT:semidirect-product",
  "GT:profinite-group",
  "GT:wreath-product",
  "GT:torsion-group",
  "GT:derived-series",
  "HA:abelian-category",
  "HA:exact-sequence",
  "HA:grothendieck-group",
  "HA:ext-functors",
  "HA:composition-series",
  "HA:yoneda-product",
  "HA:homological-dimension",
  "HT:kan-complex",
  "HT:model-category",
  "LA:invertible-matrix",
  "LA:determinant",
  "LA:diagonalization",
  "LA:algebraic-geometric-multiplicity",
  "LA:grassmannian",
  "LA:hermitian-matrix",
  "LA:spin-group",
  "LA:quadratic-form",
  "LA:matrix-exponential",
  "NT:valuation",
  "NT:archimedean-valuation",
  "NT:hensel-lifting-lemma",
  "NT:discriminant",
  "NT:resultant",
  "RT:representation-ring",
  "TO:covering-space",
  "TO:galois-cover",
  "TO:universal-covering-space",
  "TO:metric-space",
  "TO:cauchy-sequence",
  "UN:koszul-complex",
  "UN:pure-hodge-structure",
];
