const examples = [
  "AA:saturated-monoid",
  "AA:semiring",
  "AA:hopf-algebra",
  "AA:group-like-element",
  "AA:frobenius-algebra",
  "AA:weyl-algebra",
  "AA:division-algebra",
  "AA:koszul-algebra",
  "AA:hochschild-homology",
  "AA:unit",
  "AA:zero-divisor",
  "AA:nilpotent-element",
  "AA:unipotent-element",
  "AA:reduced-ring",
  "AA:finite-presentation",
  "AA:idempotent-element",
  "AA:noetherian-ring",
  "AA:localization",
  "AA:regular-ring",
  "AA:field-of-fractions",
  "AA:discrete-valuation-ring",
  "AA:artin-ring",
  "AA:regular-sequence",
  "AA:hilbert-series",
  "AA:hilbert-polynomial",
  "AA:standard-smooth-algebra",
  "AA:fitting-ideal",
  "AA:graded-ring",
  "AA:morita-equivalence",
  "AA:homogeneous-ideal",
  "AA:irrelevant-ideal",
  "AA:algebra",
  "AA:derivation",
  "AA:completion",
  "AA:azumaya-algebra",
  "AA:simple-ring",
  "AA:central-simple-algebra",
  "AA:involutive-ring",
  "AA:involutive-algebra",
  "AA:division-ring",
  "AA:prime-avoidance-lemma",
  "AA:integrally-closed-domain",
  "AA:eisenstein-polynomial",
  "AA:primitive-polynomial",
  "AA:formal-group-law",
  "AA:dedekind-domain",
  "AA:corner-ring",
  "AA:characteristic",
  "AA:symmetric-polynomial",
  "AA:ore-extension",
  "AA:divided-power-structure",
  "AA:algebraic-transcendental",
  "AA:frobenius-morphism",
  "AA:splitting-field",
  "AA:perfect-field",
  "AA:normal-field-extension",
  "AA:separable-field-extension",
  "AA:algebraically-closed-field",
  "AA:lie-algebra",
  "AA:lie-algebra-ideal",
  "AA:nilpotent-lie-algebra",
  "AA:solvable-lie-algebra",
  "AA:cartan-subalgebra",
  "AA:universal-enveloping-algebra",
  "AA:simple-lie-algebra",
  "AA:root-system-lie-algebra",
  "AA:killing-form",
  "AA:cartan-criterion",
  "AA:engel-theorem",
  "AA:lie-theorem",
  "AA:radical-lie-algebra",
  "AA:dynkin-diagram",
  "AA:lie-algebra-representation",
  "AA:verma-module",
  "AA:casimir-element",
  "AA:dg-lie-algebra",
  "AA:maurer-cartan-equation",
  "AA:projective-module",
  "AA:flat-module",
  "AA:length-module",
  "AA:bimodule",
  "AA:torsionless-module",
  "AA:indecomposable-module",
  "AA:quantized-universal-enveloping-algebra",
  "AA:universal-r-matrix",
  "AA:quantum-yang-baxter-equation",
  "AG:affine-morphism",
  "AG:quasi-compact-scheme",
  "AG:normal-scheme",
  "AG:separated-morphism",
  "AG:proper-morphism",
  "AG:smooth-morphism",
  "AG:formally-smooth",
  "AG:formally-unramified",
  "AG:formally-etale",
  "AG:flat-morphism",
  "AG:picard-group",
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
  "AG:sheaf-differentials",
  "AG:flag-variety",
  "AG:slope-vector-bundle",
  "AG:geometric-quotient",
  "AG:affine-git-quotient",
  "AG:affine-variety",
  "AG:hodge-deligne-polynomial",
  "AG:genus-degree-formula",
  "AG:lie-kolchin-theorem",
  "AG:triangularizable-algebraic-group",
  "AG:unipotent-algebraic-group",
  "AG:special-algebraic-group",
  "AG:hasse-weil-zeta-function",
  "AG:kapranov-zeta-function",
  "AG:invertible-sheaf",
  "AG:sheaf-cohomology",
  "AG:local-cohomology",
  "AG:log-scheme",
  "AG:log-differentials",
  "AG:characteristic-monoid-sheaf",
  "AT:singular-homology",
  "AT:deformation-retract",
  "AT:homotopy-equivalence",
  "AT:seifert-van-kampen-theorem",
  "AT:hurewicz-fibration",
  "AT:serre-fibration",
  "AT:eilenberg-maclane-space",
  "AT:cw-complex",
  "AT:loop-space",
  "AT:homotopy-fiber",
  "AT:poincare-polynomial",
  "AT:cellular-homology",
  "AT:factorization-homology",
  "AT:spectrum",
  "CT:enriched-category",
  "CT:simplicial-object",
  "CT:nerve",
  "CT:infinity-category",
  "CT:monoid-object",
  "CT:weighted-limit",
  "CT:yoneda-lemma",
  "CT:equivalence-of-categories",
  "CT:adjunction",
  "CT:localization",
  "CT:limit",
  "CT:comma-category",
  "CT:inverse-limit",
  "CT:direct-limit",
  "CT:galois-category",
  "CT:category-fibered-in-groupoids",
  "CT:monad",
  "CT:eilenberg-moore-category",
  "CT:cartesian-closed-category",
  "CT:kleisli-category",
  "CT:subobject-classifier",
  "CT:topos",
  "CT:kan-extension",
  "CT:regular-category",
  "CT:concrete-category",
  "CT:end",
  "CT:balanced-category",
  "CT:group-object",
  "CT:filtered-category",
  "CT:strict-epimorphism",
  "CT:strict-monomorphism",
  "CT:compact-object",
  "CT:skeleton",
  "CT:presentable-category",
  "CT:monoidal-category",
  "CT:symmetric-monoidal-category",
  "CT:internal-hom",
  "CT:ribbon-category",
  "DG:smooth-structure",
  "DG:immersion",
  "DG:exterior-derivative",
  "DG:interior-product",
  "DG:lie-derivative",
  "DG:parallelizable-manifold",
  "DG:whitney-embedding-theorem",
  "DG:complex-manifold",
  "DG:connection",
  "DG:curvature-connection",
  "DG:bianchi-identity",
  "DG:christoffel-symbols",
  "DG:parallel-transport",
  "DG:distribution",
  "DG:involutive-distribution",
  "DG:geodesic",
  "DG:exponential-map",
  "DG:bordism",
  "DG:lie-algebroid",
  "DG:volume-form",
  "DG:courant-algebroid",
  "DG:legendre-transform",
  "DG:nijenhuis-tensor",
  "DG:generalized-complex-structure",
  "DG:orientable-manifold",
  "DG:isometry",
  "DG:stokes-theorem",
  "DG:teichmuller-space",
  "DG:hairy-ball-theorem",
  "DG:einstein-manifold",
  "DG:symplectic-manifold",
  "DG:tautological-one-form",
  "DG:canonical-symplectic-form",
  "DG:symplectic-vector-field",
  "DG:hamiltonian-vector-field",
  "DG:poisson-manifold",
  "DG:darboux-theorem",
  "DG:moser-stability",
  "DG:compatible-triple",
  "DG:moyal-weyl-product",
  "DG:fedosov-manifold",
  "DG:lagrangian-submanifold",
  "DG:adjoint-representation",
  "DG:lie-theorems",
  "DG:weyl-group-lie-group",
  "DG:poisson-lie-group",
  "DG:lie-groupoid",
  "FA:norm",
  "FA:equivalent-norms",
  "FA:c-star-algebra",
  "FA:seminorm",
  "FA:fredholm-operator",
  "GM:generating-function",
  "GT:normal-subgroup",
  "GT:solvable-group",
  "GT:dihedral-group",
  "GT:semidirect-product",
  "GT:profinite-group",
  "GT:wreath-product",
  "GT:torsion-group",
  "GT:derived-series",
  "GT:braid-group",
  "GT:modular-group",
  "GT:free-product",
  "GT:sylow-theorem",
  "GT:nilpotent-group",
  "GT:abelianization",
  "GT:shuffle",
  "HA:abelian-category",
  "HA:exact-sequence",
  "HA:chain-homotopy",
  "HA:chain-homotopy-equivalence",
  "HA:quasi-isomorphism",
  "HA:injective-resolution",
  "HA:acyclic-object",
  "HA:five-lemma",
  "HA:grothendieck-group",
  "HA:ext-functors",
  "HA:tor-functors",
  "HA:composition-series",
  "HA:yoneda-product",
  "HA:homological-dimension",
  "HA:mapping-cone",
  "HA:enough-injectives",
  "HA:delta-functor",
  "HA:group-cohomology",
  "HA:contractible-chain-complex",
  "HA:effaceable-functor",
  "HA:finite-abelian-category",
  "HA:deligne-tensor-product",
  "HA:derived-category",
  "HA:fourier-mukai-transform",
  "HA:serre-functor",
  "HA:admissible-subcategory",
  "HA:exceptional-sequence",
  "HA:semi-orthogonal-decomposition",
  "HT:kan-complex",
  "HT:model-category",
  "HT:proper-model-category",
  "HT:homotopy-limit",
  "HT:homotopy-category",
  "HT:cylinder-object",
  "HT:path-object",
  "HT:en-algebra",
  "HT:l-infinity-algebra",
  "HT:dg-category",
  "HT:dg-module",
  "LA:minkowski-theorem",
  "LA:root-system",
  "LA:weyl-group",
  "LA:polyhedral-cone",
  "LA:dual-cone",
  "LA:gordons-lemma",
  "LA:invertible-matrix",
  "LA:determinant",
  "LA:trace",
  "LA:characteristic-polynomial",
  "LA:diagonalization",
  "LA:algebraic-geometric-multiplicity",
  "LA:dual-vector-space",
  "LA:grassmannian",
  "LA:hermitian-matrix",
  "LA:spin-group",
  "LA:clifford-algebra",
  "LA:quadratic-form",
  "LA:matrix-exponential",
  "LA:pfaffian",
  "LA:cayley-hamilton-theorem",
  "LA:monomial-matrix",
  "LA:permutation-matrix",
  "LA:cramer-rule",
  "LA:cartan-matrix",
  "LA:complementary-subspaces",
  "LA:symplectic-vector-space",
  "MT:measure",
  "NT:valuation",
  "NT:archimedean-valuation",
  "NT:hensel-lifting-lemma",
  "NT:discriminant",
  "NT:resultant",
  "NT:abel-ruffini-theorem",
  "RT:representation-ring",
  "RT:schur-lemma",
  "RT:projective-representation",
  "RT:first-orthogonality-theorem",
  "TO:covering-space",
  "TO:galois-cover",
  "TO:universal-covering-space",
  "TO:metric-space",
  "TO:associated-bundle",
  "TO:cauchy-sequence",
  "TO:locally-compact-space",
  "TO:baire-space",
  "TO:mapping-cone",
  "TO:isotopy",
  "UN:koszul-complex",
  "UN:pure-hodge-structure",
];
