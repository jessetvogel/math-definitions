const examples = [
  "AA:saturated-monoid",
  "AA:semiring",
  "AA:hopf-algebra",
  "AA:frobenius-algebra",
  "AA:weyl-algebra",
  "AA:lie-algebra",
  "AA:lie-algebra-ideal",
  "AA:nilpotent-lie-algebra",
  "AA:solvable-lie-algebra",
  "AA:cartan-subalgebra",
  "AA:universal-enveloping-algebra",
  "AA:simple-lie-algebra",
  "AG:affine-morphism",
  "AG:normal-scheme",
  "AG:separated",
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
  "AT:spectrum",
  "AT:poincare-polynomial",
  "CA:unit",
  "CA:nilpotent-element",
  "CA:unipotent-element",
  "CA:reduced-ring",
  "CA:finite-presentation",
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
  "CA:prime-avoidance-lemma",
  "CA:integrally-closed-domain",
  "CA:eisenstein-polynomial",
  "CA:primitive-polynomial",
  "CA:formal-group-law",
  "CA:dedekind-domain",
  "CA:corner-ring",
  "CA:algebraic-transcendental",
  "CA:frobenius-morphism",
  "CA:splitting-field",
  "CA:perfect-field",
  "CA:normal-field-extension",
  "CA:separable-field-extension",
  "CA:algebraically-closed-field",
  "CA:projective-module",
  "CA:flat-module",
  "CA:bimodule",
  "CA:indecomposable-module",
  "CT:monoidal-category",
  "CT:symmetric-monoidal-category",
  "CT:enriched-category",
  "CT:simplicial-object",
  "CT:nerve",
  "CT:infinity-category",
  "CT:monoid-object",
  "CT:yoneda-lemma",
  "CT:adjoint-functors",
  "CT:localization",
  "CT:limit",
  "CT:fiber",
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
  "DG:immersion",
  "DG:exterior-derivative",
  "DG:interior-product",
  "DG:lie-derivative",
  "DG:whitney-embedding-theorem",
  "DG:complex-manifold",
  "DG:connection",
  "DG:curvature-connection",
  "DG:bianchi-identity",
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
  "DG:weyl-group-lie-group",
  "FA:norm",
  "FA:equivalent-norms",
  "FA:c-star-algebra",
  "FA:seminorm",
  "FA:fredholm-operator",
  "GT:normal-subgroup",
  "GT:solvable-group",
  "GT:dihedral-group",
  "GT:semidirect-product",
  "GT:profinite-group",
  "GT:wreath-product",
  "GT:torsion-group",
  "GT:derived-series",
  "GT:modular-group",
  "GT:free-product",
  "GT:sylow-theorem",
  "GT:nilpotent-group",
  "GT:abelianization",
  "HA:abelian-category",
  "HA:exact-sequence",
  "HA:chain-homotopy",
  "HA:chain-homotopy-equivalence",
  "HA:quasi-isomorphism",
  "HA:injective-resolution",
  "HA:grothendieck-group",
  "HA:ext-functors",
  "HA:composition-series",
  "HA:yoneda-product",
  "HA:homological-dimension",
  "HA:mapping-cone",
  "HA:enough-injectives",
  "HA:delta-functor",
  "HA:group-cohomology",
  "HA:contractible-chain-complex",
  "HA:derived-category",
  "HA:fourier-mukai-transform",
  "HA:serre-functor",
  "HA:exceptional-sequence",
  "HA:semi-orthogonal-decomposition",
  "HT:kan-complex",
  "HT:model-category",
  "HT:proper-model-category",
  "HT:homotopy-limit",
  "HT:homotopy-category",
  "HT:cylinder-object",
  "HT:path-object",
  "LA:minkowski-theorem",
  "LA:invertible-matrix",
  "LA:determinant",
  "LA:trace",
  "LA:characteristic-polynomial",
  "LA:diagonalization",
  "LA:algebraic-geometric-multiplicity",
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
