const examples = [
  "AA:field",
  "AA:maximal-ideal",
  "AA:finitely-presented-algebra",
  "AA:noetherian-ring",
  "AA:localization",
  "AA:regular-ring",
  "AA:field-of-fractions",
  "AA:valuation-ring",
  "AA:discrete-valuation-ring",
  "AA:artin-ring",
  "AA:quotient-ideal",
  "AA:regular-sequence",
  "AA:hilbert-series",
  "AA:hilbert-polynomial",
  "AA:standard-smooth-algebra",
  "AA:standard-etale-algebra",
  "AA:fitting-ideal",
  "AA:completion",
  "AA:prime-avoidance-lemma",
  "AA:integrally-closed-domain",
  "AA:finitely-generated-algebra",
  "AA:eisenstein-polynomial",
  "AA:primitive-polynomial",
  "AA:formal-group-law",
  "AA:dedekind-domain",
  "AA:symmetric-polynomial",
  "AA:divided-power-structure",
  "AA:lambda-structure",
  "AA:krull-domain",
  "AA:associated-prime",
  "AA:plethystic-exponential",
  "AA:witt-vectors",
  "AA:saturated-monoid",
  "AA:sharp-monoid",
  "AA:semiring",
  "AA:hopf-algebra",
  "AA:group-like-element",
  "AA:frobenius-algebra",
  "AA:weyl-algebra",
  "AA:division-algebra",
  "AA:koszul-algebra",
  "AA:hochschild-homology",
  "AA:noether-bound",
  "AA:noether-normalization-lemma",
  "AA:matrix-factorization",
  "AA:unit-element",
  "AA:zero-divisor",
  "AA:nilpotent-element",
  "AA:unipotent-element",
  "AA:reduced-ring",
  "AA:group-ring",
  "AA:idempotent-element",
  "AA:graded-ring",
  "AA:morita-equivalence",
  "AA:homogeneous-ideal",
  "AA:irrelevant-ideal",
  "AA:algebra",
  "AA:derivation",
  "AA:azumaya-algebra",
  "AA:simple-ring",
  "AA:central-simple-algebra",
  "AA:involutive-ring",
  "AA:involutive-algebra",
  "AA:cotangent-complex",
  "AA:division-ring",
  "AA:corner-ring",
  "AA:characteristic",
  "AA:ore-extension",
  "AA:von-neumann-regular-ring",
  "AA:algebraic-transcendental",
  "AA:frobenius-morphism",
  "AA:splitting-field",
  "AA:perfect-field",
  "AA:normal-field-extension",
  "AA:separable-field-extension",
  "AA:algebraically-closed-field",
  "AA:primitive-element-theorem",
  "AA:cyclotomic-polynomial",
  "AA:zariski-lemma",
  "AA:transcendence-degree",
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
  "AA:chevalley-basis",
  "AA:trace-form-lie-algebra",
  "AA:chevalley-shephard-todd-theorem",
  "AA:molien-formula",
  "AA:symmetric-algebra",
  "AA:projective-module",
  "AA:flat-module",
  "AA:length-module",
  "AA:bimodule",
  "AA:torsionless-module",
  "AA:indecomposable-module",
  "AA:lazard-theorem",
  "AA:baers-criterion",
  "AA:stably-free-module",
  "AA:schur-functor",
  "AA:koszul-complex",
  "AA:shapiro-lemma",
  "AA:pseudo-coherent-module",
  "AA:projective-dimension",
  "AA:superfluous-submodule",
  "AA:quantized-universal-enveloping-algebra",
  "AA:universal-r-matrix",
  "AA:quantum-yang-baxter-equation",
  "AG:quotient-stack",
  "AG:chow-motive",
  "AG:voevodsky-motive",
  "AG:algebraic-group",
  "AG:reductive-algebraic-group",
  "AG:algebraic-torus",
  "AG:borel-subgroup",
  "AG:lie-kolchin-theorem",
  "AG:triangularizable-algebraic-group",
  "AG:unipotent-algebraic-group",
  "AG:special-algebraic-group",
  "AG:langlands-dual-group",
  "AG:bruhat-decomposition",
  "AG:langs-theorem",
  "AG:kostant-rosenlicht-theorem",
  "AG:isogeny",
  "AG:cartier-dual",
  "AG:wonderful-compactification",
  "AG:deligne-lustzig-variety",
  "AG:spectrum-ring",
  "AG:quasi-finite-morphism",
  "AG:affine-morphism",
  "AG:quasi-compact-scheme",
  "AG:normal-scheme",
  "AG:separated-morphism",
  "AG:proper-morphism",
  "AG:projective-morphism",
  "AG:smooth-morphism",
  "AG:formally-smooth",
  "AG:formally-unramified",
  "AG:formally-etale",
  "AG:flat-morphism",
  "AG:picard-group",
  "AG:picard-functor",
  "AG:complete-intersection",
  "AG:fppf-covering",
  "AG:fpqc-covering",
  "AG:birational-map",
  "AG:galois-cover",
  "AG:group-scheme",
  "AG:severi-brauer-variety",
  "AG:toric-variety",
  "AG:formal-completion",
  "AG:ample-invertible-sheaf",
  "AG:cech-cohomology",
  "AG:sheaf-differentials",
  "AG:flag-variety",
  "AG:slope-vector-bundle",
  "AG:affine-variety",
  "AG:e-polynomial",
  "AG:grothendieck-ring-of-varieties",
  "AG:genus-degree-formula",
  "AG:hasse-weil-zeta-function",
  "AG:kapranov-zeta-function",
  "AG:valuative-criterion",
  "AG:spreading-out",
  "AG:blowup",
  "AG:normal-crossings-divisor",
  "AG:etale-fundamental-group",
  "AG:grothendieck-trace-formula",
  "AG:motivic-integration",
  "AG:nisnevich-morphism",
  "AG:jacobian-variety",
  "AG:semi-separated-morphism",
  "AG:function-field",
  "AG:weil-restriction",
  "AG:dimension-scheme",
  "AG:geometric-quotient",
  "AG:affine-git-quotient",
  "AG:projective-git-quotient",
  "AG:luna-stratification",
  "AG:s-equivalence",
  "AG:kempf-ness-theorem",
  "AG:hilbert-mumford-weight",
  "AG:hilbert-mumford-criterion",
  "AG:invertible-sheaf",
  "AG:coherent-sheaf",
  "AG:sheaf-cohomology",
  "AG:local-cohomology",
  "AG:extension-by-zero",
  "AG:log-scheme",
  "AG:log-etale-morphism",
  "AG:log-differentials",
  "AG:characteristic-monoid-sheaf",
  "AT:singular-homology",
  "AT:mayer-vietoris-sequence",
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
  "AT:euler-characteristic",
  "AT:brouwer-fixed-point-theorem",
  "AT:lefschetz-fixed-point-theorem",
  "AT:universal-bundle",
  "CA:holomorphic-function",
  "CA:cauchy-riemann-equations",
  "CA:julia-set",
  "CA:modular-form",
  "CP:monomial-order",
  "CT:enriched-category",
  "CT:monoid-object",
  "CT:weighted-limit",
  "CT:derivator",
  "CT:simplicial-object",
  "CT:nerve",
  "CT:infinity-category",
  "CT:hypercover",
  "CT:yoneda-lemma",
  "CT:equivalence-of-categories",
  "CT:adjunction",
  "CT:localization",
  "CT:limit",
  "CT:comma-category",
  "CT:inverse-limit",
  "CT:direct-limit",
  "CT:galois-category",
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
  "CT:idempotent-morphism",
  "CT:compact-object",
  "CT:skeleton",
  "CT:presentable-category",
  "CT:natural-numbers-object",
  "CT:connected-category",
  "CT:setoid",
  "CT:dense-functor",
  "CT:density-theorem",
  "CT:lawvere-fixed-point-theorem",
  "CT:grothendieck-construction",
  "CT:internal-category",
  "CT:image",
  "CT:strongly-cartesian-morphism",
  "CT:category-fibered-in-groupoids",
  "CT:inertia-stack",
  "CT:gerbe",
  "CT:monoidal-category",
  "CT:symmetric-monoidal-category",
  "CT:rigid-monoidal-category",
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
  "DG:orbifold",
  "DG:orbifold-euler-characteristic",
  "DG:conformal-map",
  "DG:gradient",
  "DG:symplectic-manifold",
  "DG:tautological-one-form",
  "DG:canonical-symplectic-form",
  "DG:symplectic-vector-field",
  "DG:hamiltonian-vector-field",
  "DG:moment-map",
  "DG:marsden-weinstein-quotient",
  "DG:poisson-manifold",
  "DG:darboux-theorem",
  "DG:moser-stability",
  "DG:compatible-triple",
  "DG:moyal-weyl-product",
  "DG:fedosov-manifold",
  "DG:lagrangian-submanifold",
  "DG:contact-structure",
  "DG:reeb-vector-field",
  "DG:noether-theorem",
  "DG:goldman-symplectic-form",
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
  "FA:k-theory-c-star-algebra",
  "GM:generating-function",
  "GM:mobius-function",
  "GM:schur-function",
  "GM:hall-inner-product",
  "GM:integer-partition",
  "GM:conjugate-partition",
  "GM:fermat-little-theorem",
  "GM:lagrange-polynomial",
  "GM:continued-fraction",
  "GT:normal-subgroup",
  "GT:regular-group-action",
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
  "GT:frattini-subgroup",
  "GT:complete-group",
  "GT:perfect-group",
  "GT:burnside-ring",
  "GT:lagrange-theorem",
  "GT:characteristic-subgroup",
  "GT:subnormal-subgroup",
  "GT:pontryagin-dual",
  "GT:p-group",
  "GT:ascendant-subgroup",
  "GT:burnside-lemma",
  "GT:ambivalent-group",
  "GT:group-determinant",
  "HA:abelian-category",
  "HA:exact-sequence",
  "HA:long-exact-sequence-cohomology",
  "HA:chain-homotopy",
  "HA:chain-homotopy-equivalence",
  "HA:quasi-isomorphism",
  "HA:injective-resolution",
  "HA:acyclic-object",
  "HA:five-lemma",
  "HA:spectral-sequence",
  "HA:grothendieck-group",
  "HA:ext-functors",
  "HA:tor-functors",
  "HA:jordan-holder-theorem",
  "HA:semisimplification",
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
  "HA:verdier-quotient",
  "HA:t-structure",
  "HT:kan-complex",
  "HT:moore-complex",
  "HT:geometric-realization",
  "HT:en-algebra",
  "HT:l-infinity-algebra",
  "HT:dg-category",
  "HT:dg-module",
  "HT:model-category",
  "HT:proper-model-category",
  "HT:quillen-equivalence",
  "HT:homotopy-limit",
  "HT:homotopy-category",
  "HT:cylinder-object",
  "HT:path-object",
  "LA:minkowski-theorem",
  "LA:root-system",
  "LA:weyl-group",
  "LA:root-datum",
  "LA:weight-lattice",
  "LA:polyhedral-cone",
  "LA:dual-cone",
  "LA:gordons-lemma",
  "LA:fan-refinement",
  "LA:star-subdivision",
  "LA:pick-theorem",
  "LA:pure-hodge-structure",
  "LA:invertible-matrix",
  "LA:determinant",
  "LA:trace",
  "LA:characteristic-polynomial",
  "LA:diagonalizable-matrix",
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
  "LA:defective-matrix",
  "LA:row-echelon-form",
  "LA:hessenberg-matrix",
  "LA:gram-matrix",
  "LA:unimodular-matrix",
  "LA:jordan-normal-form",
  "LA:general-affine-group",
  "LA:symplectic-vector-space",
  "LO:diaconescu-theorem",
  "MT:measure",
  "MT:haar-measure",
  "MT:outer-measure",
  "NT:kummer-dedekind-theorem",
  "NT:p-adic-numbers",
  "NT:discriminant",
  "NT:resultant",
  "NT:abel-ruffini-theorem",
  "NT:adele-ring",
  "NT:euclid-theorem",
  "NT:valuation",
  "NT:archimedean-valuation",
  "NT:hensel-lifting-lemma",
  "NT:local-field",
  "NT:krasner-lemma",
  "NT:valuation-topology",
  "RT:representation-ring",
  "RT:schur-lemma",
  "RT:projective-representation",
  "RT:dual-representation",
  "RT:first-orthogonality-theorem",
  "RT:regular-representation",
  "RT:tannakian-category",
  "RT:maschke-theorem",
  "RT:induced-representation",
  "RT:frobenius-reciprocity",
  "RT:artin-theorem",
  "RT:permutation-representation",
  "RT:standard-representation",
  "RT:jacquet-module",
  "RT:witten-zeta-function",
  "RT:pseudoreal-representation",
  "RT:frobenius-schur-indicator",
  "RT:frobenius-formula",
  "RT:permutation-module",
  "RT:fourier-transform-finite-groups",
  "RT:coinduced-representation",
  "RT:schur-index",
  "ST:well-order",
  "ST:lattice",
  "ST:boolean-algebra",
  "ST:modular-lattice",
  "ST:filter",
  "ST:cantor-theorem",
  "TO:path-connected-space",
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
  "TO:alexandroff-topology",
  "TO:local-system",
  "TO:deck-transformation",
  "TO:totally-disconnected-space",
  "TO:totally-separated-space",
  "TO:arc-connected-space",
  "TO:ultraconnected-space",
  "TO:isolated-point",
  "TO:mapping-class-group",
  "UN:topological-quantum-field-theory",
];
