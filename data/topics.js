const topics = {
  "AG:ringed-space": "ringed space",
  "AG:spectrum": "spectrum",
  "AG:affine-scheme": "affine scheme",
  "AG:scheme": "scheme",
  "AG:reduced-scheme": "reduced scheme",
  "AG:integral-scheme": "integral scheme",
  "AG:noetherian-scheme": "noetherian scheme",
  "AG:finite-type": "(locally) of finite type",
  "AG:finite-presentation": "(locally) of finite presentation",
  "AG:finite-morphism": "finite morphism",
  "AG:open-immersion": "open immersion",
  "AG:closed-immersion": "closed immersion",
  "AG:immersion": "immersion",
  "AG:affine-morphism": "affine morphism",
  "AG:normal-scheme": "normal scheme",
  "AG:separated-morphism": "(quasi) separated morphism",
  "AG:proper-morphism": "proper morphism",
  "AG:projective-morphism": "(quasi) projective morphism",
  "AG:regular-scheme": "regular scheme",
  "AG:variety": "variety",
  "AG:complete-variety": "complete variety",
  "AG:O-module": "sheaf of O-modules",
  "AG:free-sheaf": "(locally) free sheaf",
  "AG:invertible-sheaf": "invertible sheaf",
  "AG:sheaf-of-ideals": "sheaf of ideals",
  "AG:sheaf-associated-to-module": "sheaf associated to module",
  "AG:coherent-sheaf": "(quasi) coherent sheaf",
  "AG:ideal-sheaf": "ideal sheaf",
  "AG:twisting-sheaf": "twisting sheaf",
  "AG:geometrically-regular": "geometrically regular",
  "AG:smooth-morphism": "smooth morphism",
  "AG:unramified-morphism": "unramified morphism",
  "AG:etale-morphism": "étale morphism",
  "AG:formally-smooth": "formally smooth morphism",
  "AG:formally-unramified": "formally unramified morphism",
  "AG:formally-etale": "formally étale morphism",
  "AG:flat-morphism": "flat morphism",
  "AG:dominant-morphism": "dominant morphism",
  "AG:serre-duality": "Serre duality",
  "AG:picard-group": "Picard group",
  "AG:euler-sequence": "Euler sequence",
  "AG:complete-intersection": "complete intersection",
  "AG:tangent-sheaf": "tangent sheaf",
  "AG:canonical-sheaf": "canonical sheaf",
  "AG:geometric-genus": "geometric genus",
  "AG:normal-sheaf": "(co)normal sheaf",
  "AG:geometric-point": "geometric point",
  "AG:fppf-covering": "fppf covering",
  "AG:fpqc-covering": "fpqc covering",
  "AG:faithfully-flat-morphism": "faithfully flat morphism",
  "AG:big-small-site": "big/small site",
  "AG:projection-formula": "projection formula",
  "AG:log-scheme": "Log scheme",
  "AG:fine-log-scheme": "fine log scheme",
  "AG:log-smooth-morphism": "log smooth morphism",
  "AG:log-etale-morphism": "log étale morphism",
  "AG:log-differentials": "log differentials",
  "AG:sheaf": "sheaf",
  "AG:constant-sheaf": "constant sheaf",
  "AG:stalk": "stalk",
  "AG:associated-sheaf": "associated sheaf",
  "AG:direct-image-sheaf": "direct image sheaf",
  "AG:inverse-image-sheaf": "inverse image sheaf",
  "AG:flasque-sheaf": "flasque sheaf",
  "AG:skyscraper-sheaf": "skyscraper sheaf",
  "AG:sheaf-hom": "sheaf hom",
  "AG:stack": "stack",
  "AG:artin-stack": "Artin stack",
  "AG:deligne-mumford-stack": "Deligne-Mumford stack",
  "AG:quotient-stack": "quotient stack",
  "AT:homology-group": "homology group",
  "AT:long-exact-sequence-homology": "long exact sequence in homology",
  "AT:singular-homology": "singular (co)homology",
  "AT:fundamental-group": "fundamental group",
  "AT:relative-homology": "relative homology",
  "AT:excision-theorem": "excision theorem",
  "AT:mayer-vietoris-sequence": "Mayer–Vietoris sequence",
  "AT:deformation-retract": "(strong) deformation retract",
  "AT:cup-product": "cup product",
  "AT:cap-product": "cap product",
  "AT:weak-homotopy-equivalence": "weak homotopy equivalence",
  "AT:null-homotopic": "null homotopic",
  "AT:homotopy-groups": "homotopy groups",
  "AT:cohomology-compact-support": "cohomology with compact support",
  "CA:ring": "ring",
  "CA:ring-morphism": "ring morphism",
  "CA:unit": "unit",
  "CA:irreducible-element": "irreducible element",
  "CA:zero-divisor": "zero-divisor",
  "CA:nilpotent-element": "nilpotent element",
  "CA:domain": "domain",
  "CA:field": "field",
  "CA:ideal": "ideal",
  "CA:coprime-ideals": "coprime ideals",
  "CA:radical-ideal": "radical ideal",
  "CA:principal-ideal": "principal ideal",
  "CA:prime-ideal": "prime ideal",
  "CA:maximal-ideal": "maximal ideal",
  "CA:irreducible-ideal": "irreducible ideal",
  "CA:local-ring": "local ring",
  "CA:local-morphism": "local morphism",
  "CA:finite-type": "finite type",
  "CA:finite-presentation": "finite presentation",
  "CA:krull-dimension": "Krull dimension",
  "CA:group-ring": "group ring",
  "CA:chinese-remainder-theorem": "Chinese remainder theorem",
  "CA:idempotent": "idempotent",
  "CA:dual-numbers": "dual numbers",
  "CA:noetherian-ring": "noetherian ring",
  "CA:localization": "localization",
  "CA:regular-ring": "regular (local) ring",
  "CA:principal-ideal-domain": "principal ideal domain (PID)",
  "CA:unique-factorization-domain": "unique factorization domain (UFD)",
  "CA:euclidean-ring": "Euclidean ring",
  "CA:field-of-fractions": "field of fractions",
  "CA:valuation-ring": "valuation ring",
  "CA:discrete-valuation-ring": "discrete valuation ring",
  "CA:monic-polynomial": "monic polynomial",
  "CA:integral-element": "integral element",
  "CA:integral-closure": "integral closure",
  "CA:artin-ring": "artin ring",
  "CA:fractional-ideal": "fractional ideal",
  "CA:invertible-ideal": "invertible ideal",
  "CA:syzygy-module": "syzygy module",
  "CA:hilbert-basis-theorem": "Hilbert's basis theorem",
  "CA:hilbert-syzygy-theorem": "Hilbert's syzygy theorem",
  "CA:primary-ideal": "primary ideal",
  "CA:primary-decomposition": "primary decomposition",
  "CA:annihilator": "annihilator",
  "CA:nilradical": "nilradical",
  "CA:jacobson-radical": "Jacobson radical",
  "CA:regular-sequence": "regular sequence",
  "CA:hilbert-series": "Hilbert series",
  "CA:absolutely-flat-ring": "absolutely flat ring",
  "CA:standard-smooth": "standard smooth",
  "CA:etale-algebra": "étale algebra",
  "CA:fitting-ideal": "Fitting ideal",
  "CA:gcd": "greatest common divisor (GCD)",
  "CA:lcm": "least common multiple (LCM)",
  "CA:gcd-domain": "GCD domain",
  "CA:projective-dimension": "projective dimension",
  "CA:module": "module",
  "CA:free-module": "free module",
  "CA:cyclic-module": "cyclic module",
  "CA:projective-module": "projective module",
  "CA:injective-module": "injective module",
  "CA:flat-module": "flat module",
  "CA:faithful-module": "faithful module",
  "CA:finitely-generated-module": "finitely generated module",
  "CA:nakayamas-lemma": "Nakayama's lemma",
  "CA:faithfully-flat-module": "faithfully flat module",
  "CA:simple-module": "(semi)simple module",
  "CA:field-extension": "field extension",
  "CA:algebraic-transcendental": "algebraic/transcendental element",
  "CA:algebraic-field-extension": "algebraic field extension",
  "CA:minimal-polynomial": "minimal polynomial",
  "CA:prime-field": "prime field",
  "CA:frobenius-morphism": "frobenius morphism",
  "CA:splitting-field": "splitting field",
  "CA:separable-polynomial": "separable polynomial",
  "CA:perfect-field": "perfect field",
  "CA:normal-field-extension": "normal field extension",
  "CA:separable-field-extension": "separable field extension",
  "CA:galois-extension": "Galois extension",
  "CA:galois-group": "Galois group",
  "CA:algebraically-closed-field": "algebraically closed field",
  "CA:algebraic-closure": "algebraic closure",
  "CA:tensor-product": "tensor product",
  "CA:tensor-algebra": "tensor algebra",
  "CA:symmetric-algebra": "symmetric algebra",
  "CA:exterior-algebra": "exterior algebra",
  "CP:groebner-basis": "Gröbner basis",
  "CT:category": "category",
  "CT:full-subcategory": "full subcategory",
  "CT:functor": "functor",
  "CT:monomorphism": "monomorphism",
  "CT:epimorphism": "epimorphism",
  "CT:split-mono": "split monomorphism",
  "CT:split-epi": "split epimorphism",
  "CT:isomorphism": "isomorphism",
  "CT:terminal-object": "terminal object",
  "CT:initial-object": "initial object",
  "CT:full-functor": "full functor",
  "CT:faithful-functor": "faithful functor",
  "CT:natural-transformation": "natural transformation",
  "CT:yoneda-embedding": "Yoneda embedding",
  "CT:yoneda-lemma": "Yoneda lemma",
  "CT:groupoid": "groupoid",
  "CT:equivalence-of-categories": "equivalence of categories",
  "CT:essentially-surjective-functor": "essentially surjective functor",
  "CT:equalizer": "equalizer",
  "CT:coequalizer": "coequalizer",
  "CT:fiber-product": "fiber product",
  "CT:regular-monomorphism": "regular monomorphism",
  "CT:adjoint-functors": "adjoint functors",
  "CT:retraction": "retraction",
  "CT:section": "section",
  "CT:sieve": "sieve",
  "CT:grothendieck-topology": "Grothendieck topology",
  "CT:site": "site",
  "CT:sheaf": "sheaf",
  "CT:localization": "localization",
  "CT:limit": "(co)limit",
  "CT:category-of-elements": "category of elements",
  "CT:small-category": "small category",
  "DG:de-rham-isomorphism": "de Rham isomorphism",
  "DG:poincare-duality": "Poincaré duality",
  "DT:deformation-functor": "deformation functor",
  "DT:tangent-obstruction-theory": "tangent-obstruction-theory",
  "DT:schlessingers-criteria": "Schlessinger's criteria",
  "DT:pro-representable-hull": "pro-representable hull",
  "DT:hilbert-functor": "Hilbert functor",
  "DT:quot-functor": "Quot functor",
  "GT:group": "group",
  "GT:subgroup": "subgroup",
  "GT:abelian-group": "abelian group",
  "GT:order": "order",
  "GT:cyclic-group": "cyclic group",
  "GT:group-homomorphism": "group homomorphism",
  "GT:kernel": "kernel",
  "GT:group-center": "group center",
  "GT:symmetric-group": "symmetric group",
  "GT:cayleys-theorem": "Cayley's theorem",
  "GT:cyclic-permutation": "cyclic permutation",
  "GT:permutation-sign": "permutation sign",
  "GT:alternating-group": "alternating group",
  "GT:normal-subgroup": "normal subgroup",
  "GT:quotient-group": "quotient-group",
  "GT:simple-group": "simple group",
  "GT:torsion-subgroup": "torsion subgroup",
  "GT:normalizer": "normalizer",
  "GT:group-action": "group action",
  "GT:centralizer": "centralizer",
  "GT:stabilizer": "stabilizer",
  "GT:orbit": "orbit",
  "GT:solvable-group": "solvable group",
  "GT:commutator-subgroup": "commutator subgroup",
  "HA:additive-category": "additive category",
  "HA:abelian-category": "abelian category",
  "HA:additive-functor": "additive functor",
  "HA:exact-functor": "exact functor",
  "HA:injective-object": "injective object",
  "HA:projective-object": "projective object",
  "HA:chain-complex": "chain complex",
  "HA:homology-object": "homology object",
  "HA:long-exact-sequence-homology": "long exact sequence in homology",
  "HA:homotopy": "homotopy",
  "HA:homotopy-equivalence": "homotopy equivalence",
  "HA:quasi-isomorphism": "quasi-isomorphism",
  "HA:injective-resolution": "injective resolution",
  "HA:projective-resolution": "projective resolution",
  "HA:right-derived-functors": "right derived functors",
  "HA:five-lemma": "five lemma",
  "HA:snake-lemma": "snake lemma",
  "HA:spectral-sequence": "spectral sequence",
  "HA:serre-subcategory": "Serre subcategory",
  "HA:grothendieck-group": "Grothendieck group",
  "HA:triangulated-category": "triangulated category",
  "HA:exact-functor-triangulated": "exact functor of triangulated categories",
  "HA:triangulated-subcategory": "triangulated subcategory",
  "HA:admissible-subcategory": "admissible subcategory",
  "HA:orthogonal-complement": "orthogonal complement",
  "HA:spanning-class": "spanning class",
  "HA:exceptional-sequence": "exceptional sequence",
  "HA:semi-orthogonal-decomposition": "semi-orthogonal decomposition",
  "HA:thick-subcategory": "thick-subcategory",
  "HA:derived-category": "derived category",
  "HA:perfect-complex": "perfect complex",
  "LA:vector-space": "vector space",
  "LA:vector-subspace": "vector-subspace",
  "LA:linearly-independent": "linearly independent",
  "LA:span": "span",
  "LA:basis": "basis",
  "LA:dimension": "dimension",
  "LA:linear-transformation": "linear transformation",
  "LA:matrix-representation": "matrix representation",
  "LA:matrix-multiplication": "matrix multiplication",
  "LA:matrix-transpose": "matrix transpose",
  "LA:invertible-matrix": "invertible matrix",
  "LA:matrix-rank": "matrix rank",
  "LA:nullspace": "nullspace",
  "LA:projection": "projection",
  "LA:determinant": "determinant",
  "LA:cofactor-matrix": "cofactor matrix",
  "LA:adjoint-matrix": "adjoint matrix",
  "LA:eigenvalue": "eigenvalue/eigenvector",
  "LA:characteristic-polynomial": "characteristic polynomial",
  "LA:diagonalization": "diagonalization",
  "LA:algebraic-geometric-multiplicity": "algebraic/geometric multiplicity",
  "NT:number-field": "number field/ring",
  "NT:diophantine-equation": "Diophantine equation",
  "NT:pell-equation": "Pell equation",
  "NT:gaussian-integers": "Gaussian integers",
  "NT:picard-group": "Picard group",
  "NT:order": "order",
  "NT:monogenic-order": "monogenic order",
  "NT:legendre-symbol": "Legendre symbol",
  "NT:ring-of-integers": "ring of integers",
  "NT:bezout-identity": "Bézout's identity",
  "TO:topological-space": "topological space",
  "TO:discrete-topology": "discrete topology",
  "TO:indiscrete-topology": "indiscrete topology",
  "TO:coarser": "coarser/finer",
  "TO:continuous": "continuous",
  "TO:homeomorphism": "homeomorphism",
  "TO:closure": "closure",
  "TO:interior": "interior",
  "TO:boundary": "boundary",
  "TO:neighborhood": "neighborhood",
  "TO:basis": "basis",
  "TO:second-countable": "second countable",
  "TO:dense": "dense",
  "TO:quasi-compact": "quasi-compact",
  "TO:specialization": "specialization",
  "TO:closed-map": "closed map",
  "TO:universally-closed": "universally closed",
  "TO:irreducible": "irreducible",
  "TO:subspace-topology": "subspace topology",
  "TO:product-topology": "product topology",
  "TO:quotient-topology": "quotient topology",
  "TO:graph": "graph",
  "TO:hausdorff": "Hausdorff",
  "TO:compact": "compact",
  "TO:connected": "connected",
  "TO:path-connected": "path-connected",
  "TO:suspension": "suspension",
  "TO:cone": "cone",
  "TO:join": "join",
  "UN:simplex-category": "simplex category",
  "UN:simplicial-object": "simplicial object",
  "UN:kan-complex": "Kan complex",
  "UN:koszul-complex": "Koszul complex",
  "UN:model-category": "model category",
  "UN:quillen-adjunction": "Quillen adjunction",
  "UN:quillen-equivalence": "Quillen equivalence",
  "UN:nerve": "nerve",
  "UN:homotopy-category": "homotopy category",
}
