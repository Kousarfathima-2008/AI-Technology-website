/**
 * ============================================================================
 * NEXORA AI – INTELLIGENCE BEYOND IMAGINATION
 * Master Interactive Frontend Engine (script.js)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ------------------------------------------------------------------------
    // 1. NEURAL PARTICLE NETWORK CANVAS (HERO BACKGROUND)
    // ------------------------------------------------------------------------
    const initNeuralCanvas = () => {
        const canvas = document.getElementById('neuralCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.parentElement.offsetWidth;
        let height = canvas.height = canvas.parentElement.offsetHeight;

        let particles = [];
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 35 : 75;
        const maxDistance = isMobile ? 100 : 145;

        const mouse = {
            x: null,
            y: null,
            radius: 170
        };

        // Resize handler
        window.addEventListener('resize', () => {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        });

        // Mouse tracking for interactive neural field
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.75;
                this.vy = (Math.random() - 0.5) * 0.75;
                this.radius = Math.random() * 2 + 1.2;
                this.color = Math.random() > 0.4 ? '#00f5d4' : '#8b5cf6';
                this.alpha = Math.random() * 0.6 + 0.3;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce at boundaries
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 2.2;
                        this.y -= (dy / dist) * force * 2.2;
                    }
                }
            }

            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 8;
                ctx.globalAlpha = this.alpha;
                ctx.fill();
                ctx.restore();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Draw connections between nearby nodes
        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        const opacity = 1 - (dist / maxDistance);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        
                        // Gradient line between cyan and violet
                        const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        grad.addColorStop(0, `rgba(0, 245, 212, ${opacity * 0.4})`);
                        grad.addColorStop(1, `rgba(139, 92, 246, ${opacity * 0.4})`);
                        
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                // Connect to cursor if nearby
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const opacity = 1 - (dist / mouse.radius);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(0, 245, 212, ${opacity * 0.6})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
            }
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawLines();
            requestAnimationFrame(animate);
        };

        animate();
    };

    initNeuralCanvas();

    // ------------------------------------------------------------------------
    // 2. AMBIENT CURSOR GLOW SPOTLIGHT
    // ------------------------------------------------------------------------
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.innerWidth > 992) {
        window.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    }

    // ------------------------------------------------------------------------
    // 3. STICKY NAVIGATION & ACTIVE SECTION HIGHLIGHTING
    // ------------------------------------------------------------------------
    const mainHeader = document.getElementById('mainHeader');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const handleScroll = () => {
        const scrollY = window.pageYOffset;

        // Sticky nav shadow
        if (scrollY > 40) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }

        // Active link spy
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ------------------------------------------------------------------------
    // 4. MOBILE NAVIGATION DRAWER
    // ------------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // ------------------------------------------------------------------------
    // 5. ANIMATED STATISTICS COUNTERS (INTERSECTION OBSERVER)
    // ------------------------------------------------------------------------
    const statsSection = document.getElementById('statsSection');
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const runCounters = () => {
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const isDecimal = counter.getAttribute('data-decimals') === '1';
            const duration = 2000; // ms
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out expo
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentVal = target * easeProgress;

                if (isDecimal) {
                    counter.innerText = currentVal.toFixed(1);
                } else {
                    counter.innerText = Math.floor(currentVal).toLocaleString();
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = isDecimal ? target.toFixed(1) : target.toLocaleString();
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    if (statsSection && counters.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    hasCounted = true;
                    runCounters();
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // ------------------------------------------------------------------------
    // 6. 3D CARD TILT EFFECT (FOR PRODUCT CARDS)
    // ------------------------------------------------------------------------
    const tiltCards = document.querySelectorAll('[data-tilt]');
    if (window.innerWidth > 992) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -7;
                const rotateY = ((x - centerX) / centerX) * 7;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }

    // ------------------------------------------------------------------------
    // 7. INTERACTIVE TECHNOLOGY PIPELINE VISUALIZER
    // ------------------------------------------------------------------------
    const pipelineNodes = document.querySelectorAll('.pipeline-node');
    const layerBadge = document.getElementById('layerBadge');
    const layerTitle = document.getElementById('layerTitle');
    const layerDesc = document.getElementById('layerDescription');
    const metric1 = document.getElementById('metric1');
    const metric2 = document.getElementById('metric2');
    const metric3 = document.getElementById('metric3');

    const layerData = {
        ingest: {
            badge: 'ACTIVE LAYER: 01',
            title: 'Ingestion & Real-Time Multimodal Telemetry',
            desc: 'High-velocity streaming ingest engine capable of parsing visual feeds, unstructured text, audio spectral data, and IoT sensor metrics simultaneously into unified high-dimensional vector embeddings.',
            m1: '100M/sec', m1Lbl: 'Throughput',
            m2: '0.24ms', m2Lbl: 'Serialization',
            m3: '99.999%', m3Lbl: 'Data Integrity'
        },
        quantum: {
            badge: 'ACTIVE LAYER: 02',
            title: 'Neural Transformer & Quantum Acceleration Core',
            desc: 'Proprietary 540-Billion parameter mixture-of-experts (MoE) foundation model operating on quantum-classical hybrid clusters. Dynamic sparse activation ensures 10x compute density.',
            m1: '540B', m1Lbl: 'Active Weights',
            m2: '1.14ms', m2Lbl: 'Tensor Latency',
            m3: '99.98%', m3Lbl: 'Convergence'
        },
        guardrails: {
            badge: 'ACTIVE LAYER: 03',
            title: 'Cryptographic Alignment & Ethical Guardrails',
            desc: 'Continuous real-time safety layer executing latent adversarial filtration, democratic value alignment, verifiable audit logs, and zero-day prompt injection neutralization.',
            m1: '0.0001', m1Lbl: 'Bias Index',
            m2: '100%', m2Lbl: 'Cryptographic Audit',
            m3: '< 0.3ms', m3Lbl: 'Filter Overhead'
        },
        inference: {
            badge: 'ACTIVE LAYER: 04',
            title: 'Sub-Millisecond Global Edge Distribution',
            desc: 'Ultra-low latency model deployment across 24 sovereign edge datacenters worldwide. Delivers deterministic execution speeds to end-users without centralized bottlenecking.',
            m1: '< 2.5ms', m1Lbl: 'Global Latency',
            m2: '24 Nodes', m2Lbl: 'Global Edge Hubs',
            m3: '99.998%', m3Lbl: 'SLA Availability'
        }
    };

    pipelineNodes.forEach(node => {
        node.addEventListener('click', () => {
            pipelineNodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            const layerKey = node.getAttribute('data-layer');
            const data = layerData[layerKey];

            if (data && layerTitle && layerDesc) {
                layerBadge.innerText = data.badge;
                layerTitle.innerText = data.title;
                layerDesc.innerText = data.desc;
                metric1.innerText = data.m1;
                metric1.nextElementSibling.innerText = data.m1Lbl;
                metric2.innerText = data.m2;
                metric2.nextElementSibling.innerText = data.m2Lbl;
                metric3.innerText = data.m3;
                metric3.nextElementSibling.innerText = data.m3Lbl;
            }
        });
    });

    // ------------------------------------------------------------------------
    // 8. INTERACTIVE AI PLAYGROUND (TERMINAL SIMULATION)
    // ------------------------------------------------------------------------
    const demoButtons = document.querySelectorAll('.demo-btn');
    const demoOutput = document.getElementById('demoOutput');

    const demoScenarios = {
        vision: [
            '> [SENSOR_INPUT] Ingesting 4K industrial optical feed: camera_07.h265',
            '> [NEXORA_VISION] Executing sub-pixel topological segmentation...',
            '> [ANALYSIS] Frame #4189: Surface scan completed in 3.4ms.',
            '> [DETECTION] Micro-fracture detected in component #NX-882 (Tolerance threshold: 0.05mm).',
            '> [METRICS] Defect confidence: 99.87% | Structural integrity: CRITICAL',
            '> [ACTION] Automated signal dispatched to pneumatic sorting arm: ISOLATE_UNIT.'
        ],
        nlp: [
            '> [QUERY] "Analyze regulatory cross-border compliance for tokenized sovereign carbon credits."',
            '> [NEXORA_CHAT] Activating 2M-token contextual legal knowledge ontology...',
            '> [REASONING STEP 1] Parsing EU CSDR, US SEC Rule 144, and Singapore MAS Guidelines...',
            '> [REASONING STEP 2] Cross-referencing bilateral double-counting prevention mechanisms...',
            '> [SYNTHESIS] "Cross-border tokenized transfer is compliant under MAS Section 4B conditional on cryptographic retirement receipt matching Article 6.2 of the Paris Agreement."',
            '> [CONFIDENCE] Semantic certainty: 99.94% | Citations: 14 verified statutes.'
        ],
        code: [
            '> [PROMPT] "Synthesize a distributed CUDA kernel for sparse matrix-tensor contraction."',
            '> [NEXORA_CREATE] Analyzing memory bandwidth bottlenecks and warp divergence...',
            '> [GENERATING] __global__ void nexora_sparse_gemm_kernel(const float* __restrict__ A, ...)',
            '> [OPTIMIZATION] Applying warp-shuffle intrinsics and asynchronous shared memory loading.',
            '> [SIMULATION] Projected throughput: 142 TFLOPS on TensorCore H100.',
            '> [VALIDATION] Unit test pass: 1,024 / 1,024 test vectors verified.'
        ]
    };

    let typingTimeout;

    const typeDemoScenario = (lines) => {
        if (!demoOutput) return;
        clearTimeout(typingTimeout);
        demoOutput.innerHTML = '';

        let lineIdx = 0;
        const printNextLine = () => {
            if (lineIdx < lines.length) {
                const p = document.createElement('p');
                p.className = 'code-line';
                if (lineIdx === 0) p.classList.add('text-cyan');
                else if (lineIdx === lines.length - 1) p.classList.add('text-green');
                else if (lines[lineIdx].includes('DETECTION') || lines[lineIdx].includes('SYNTHESIS')) p.classList.add('text-violet');

                p.innerText = lines[lineIdx];
                demoOutput.appendChild(p);
                demoOutput.scrollTop = demoOutput.scrollHeight;
                lineIdx++;
                typingTimeout = setTimeout(printNextLine, 350);
            }
        };

        printNextLine();
    };

    // Run initial demo
    typeDemoScenario(demoScenarios.vision);

    demoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            demoButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const task = btn.getAttribute('data-task');
            if (demoScenarios[task]) {
                typeDemoScenario(demoScenarios[task]);
            }
        });
    });

    // ------------------------------------------------------------------------
    // 9. PRODUCT DETAIL MODAL
    // ------------------------------------------------------------------------
    const productModal = document.getElementById('productModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalBody = document.getElementById('modalBody');
    const productExploreBtns = document.querySelectorAll('.btn-product-explore');

    const productDetails = {
        vision: {
            title: 'Nexora Vision',
            tag: 'Computer Vision Intelligence',
            icon: 'fa-eye',
            color: 'text-cyan',
            desc: 'Nexora Vision is our flagship spatial computing and optical analysis platform. Powered by custom Vision Transformers (ViT) and continuous-time volumetric fields, it enables autonomous inspection, biometric security, and dynamic scene understanding at unprecedented frame rates.',
            specs: [
                { label: 'Framerate Throughput', val: '120 FPS at 4K Resolution' },
                { label: 'Spatial Accuracy', val: 'Sub-0.01mm optical tolerance' },
                { label: 'Edge Footprint', val: 'Runs on under 15W edge silicon' },
                { label: 'Input Modalities', val: 'RGB, LiDAR, Hyperspectral, Thermal' }
            ],
            code: `// Python Quickstart: Initialize Nexora Vision Stream\nimport nexora\n\nclient = nexora.Client(api_key="nx_live_...")\nstream = client.vision.create_stream(\n    source="rtsp://camera-01.local/live",\n    models=["defect_detection", "spatial_tracking"],\n    confidence_threshold=0.99\n)\n\nfor frame_event in stream.listen():\n    print(f"Anomaly detected: {frame_event.defect_type}")`
        },
        chat: {
            title: 'Nexora Chat',
            tag: 'Conversational AI & Cognitive Agent',
            icon: 'fa-comments',
            color: 'text-violet',
            desc: 'Nexora Chat bridges the gap between human intuition and machine knowledge. Engineered with a 2,000,000 token active memory window, it conducts intricate multi-turn dialogues, solves ambiguous requests, and executes multi-step external API toolcalls with surgical accuracy.',
            specs: [
                { label: 'Context Length', val: '2,000,000 Tokens continuous' },
                { label: 'Multilingual Capacity', val: '108 Languages supported natively' },
                { label: 'Tool Calling Accuracy', val: '99.4% on complex JSON schemas' },
                { label: 'Audio Latency', val: '< 280ms full duplex voice' }
            ],
            code: `// Node.js Quickstart: Nexora Chat Agent\nimport { NexoraAI } from '@nexora/sdk';\n\nconst agent = new NexoraAI.Agent({\n  model: 'nexora-chat-v4.8',\n  systemPrompt: 'You are an autonomous corporate research partner.',\n  tools: [marketDataTool, erpQueryTool]\n});\n\nconst response = await agent.run("Synthesize Q3 supply chain risks.");\nconsole.log(response.output);`
        },
        brain: {
            title: 'Nexora Brain',
            tag: 'Advanced AI Analytics & Forecasting',
            icon: 'fa-brain',
            color: 'text-blue',
            desc: 'Nexora Brain is built for high-stakes decision makers. Unlike standard curve-fitting models, Brain utilizes causal inference frameworks and stochastic neural differential equations to model counterfactual scenarios and predict macro shifts before they materialize.',
            specs: [
                { label: 'Timeseries Sampling', val: '1,000,000 datapoints / second' },
                { label: 'Causality Engine', val: 'Structural Equation Graph Modeling' },
                { label: 'Explainability', val: 'SHAP & Integrated Gradients native' },
                { label: 'Security Standard', val: 'FIPS 140-3 Cryptographic Isolation' }
            ],
            code: `// Python: Causal Forecasting with Nexora Brain\nfrom nexora.analytics import BrainForecaster\n\nmodel = BrainForecaster(confidence_interval=0.99)\nmodel.fit(historical_telemetry_df)\n\n# Simulate interest rate shock scenario (+75bps)\nimpact = model.counterfactual_simulate(shock={'interest_rate': +0.75})\nprint(impact.projected_liquidity_summary())`
        },
        auto: {
            title: 'Nexora Auto',
            tag: 'Autonomous Workflow Automation',
            icon: 'fa-robot',
            color: 'text-emerald',
            desc: 'Nexora Auto frees human talent from repetitive operational friction. Autonomous agents orchestrate complex cross-software pipelines, interact with legacy terminal screens, reconcile disparate accounts, and self-heal whenever upstream system APIs undergo breaking updates.',
            specs: [
                { label: 'Self-Healing Rate', val: '94% of API schema changes resolved' },
                { label: 'Human-in-the-Loop', val: 'Configurable approval thresholds' },
                { label: 'Integration Ecosystem', val: 'SAP, Salesforce, Oracle, Jira, Slack' },
                { label: 'Compliance Audit', val: 'Immutable tamper-proof audit trails' }
            ],
            code: `// Python: Autonomous Workflow Orchestration\nfrom nexora.agents import WorkflowAgent\n\nagent = WorkflowAgent.from_policy("ProcureToPay_Enterprise")\nagent.connect_system("sap_erp", credentials=...)\n\n# Autonomous invoice mismatch resolution\njob = agent.dispatch_reconciliation_batch()\nprint(f"Reconciled {job.count} transactions with zero human errors.")`
        },
        data: {
            title: 'Nexora Data',
            tag: 'Data Intelligence & Synthetic Pipelines',
            icon: 'fa-database',
            color: 'text-amber',
            desc: 'Nexora Data transforms raw, siloed, and unstructured corporate data into high-value vector embeddings and rich knowledge graphs. Features a differential-privacy synthetic data generator allowing global model training without exposing customer PII.',
            specs: [
                { label: 'Vector Index Scale', val: 'Billion-scale indices with < 5ms recall' },
                { label: 'Synthetic Fidelity', val: '99.8% statistical parity to real distributions' },
                { label: 'Privacy Guarantees', val: 'Formal epsilon-differential privacy' },
                { label: 'Knowledge Graph', val: 'Automatic entity-relationship extraction' }
            ],
            code: `// Python: Synthetic Data Generation with Strict Privacy\nfrom nexora.data import SyntheticGenerator\n\ngenerator = SyntheticGenerator(epsilon=0.5, delta=1e-5)\ngenerator.learn_distribution(sensitive_medical_data)\n\nsynthetic_cohort = generator.sample(records=100000)\nsynthetic_cohort.export_parquet("hipaa_compliant_cohort.parquet")`
        },
        create: {
            title: 'Nexora Create',
            tag: 'Multimodal Generative AI Studio',
            icon: 'fa-wand-magic-sparkles',
            color: 'text-magenta',
            desc: 'Nexora Create gives designers, engineers, and content teams god-tier creative tools. Generate photorealistic 8K synthetic videos, parametric 3D CAD models, production-ready full-stack software architectures, and studio-mastered audio stems with simple prompt directives.',
            specs: [
                { label: 'Video Generation', val: 'Up to 8K resolution at 60 FPS' },
                { label: '3D Mesh Output', val: 'glTF, USDZ, OBJ with PBR materials' },
                { label: 'Code Generation', val: 'Multi-file full stack repos with unit tests' },
                { label: 'Audio Synthesis', val: 'Spatial 3D binaural studio acoustics' }
            ],
            code: `// Nexora Create CLI Transmission\n$ nexora create asset --type 3d-mesh \\\n    --prompt "Futuristic quantum server rack with glowing internal bus" \\\n    --format gltf \\\n    --pbr-materials true \\\n    --output ./assets/quantum_rack.glb\n\n> Synthesis complete in 4.12s. [14.2 MB]`
        }
    };

    const openModal = (productKey) => {
        const data = productDetails[productKey];
        if (!data || !modalBody) return;

        modalBody.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div class="product-icon-box cyan-gradient" style="width: 50px; height: 50px; font-size: 1.3rem;">
                    <i class="fa-solid ${data.icon}"></i>
                </div>
                <div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: #ffffff;">${data.title}</h3>
                    <span class="product-badge">${data.tag}</span>
                </div>
            </div>
            
            <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.65; margin-bottom: 1.75rem;">
                ${data.desc}
            </p>

            <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: #ffffff; margin-bottom: 0.75rem;">
                <i class="fa-solid fa-microchip text-cyan"></i> Architecture Specifications:
            </h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-bottom: 1.75rem;">
                ${data.specs.map(spec => `
                    <div style="background: rgba(3, 7, 18, 0.7); border: 1px solid var(--border-glass); padding: 0.75rem 1rem; border-radius: 8px;">
                        <span style="display: block; font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-muted);">${spec.label}</span>
                        <strong style="color: #ffffff; font-size: 0.88rem;">${spec.val}</strong>
                    </div>
                `).join('')}
            </div>

            <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: #ffffff; margin-bottom: 0.75rem;">
                <i class="fa-solid fa-code text-violet"></i> SDK Quickstart Implementation:
            </h4>
            <pre style="background: #020409; border: 1px solid var(--border-glass-bright); border-radius: 8px; padding: 1rem; overflow-x: auto; font-family: var(--font-mono); font-size: 0.78rem; color: #38bdf8; line-height: 1.5; margin-bottom: 2rem;"><code>${data.code}</code></pre>

            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <a href="#contact" class="btn-primary-glow btn-sm" onclick="document.getElementById('modalCloseBtn').click();">
                    <span>Deploy In Enterprise</span>
                    <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        `;

        productModal.classList.add('active');
        document.body.classList.add('no-scroll');
    };

    const closeModal = () => {
        if (!productModal) return;
        productModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };

    productExploreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const product = btn.getAttribute('data-product');
            openModal(product);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) closeModal();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModal && productModal.classList.contains('active')) {
            closeModal();
        }
    });

    // ------------------------------------------------------------------------
    // 10. CONTACT FORM VALIDATION & INTERACTIVE TRANSMISSION
    // ------------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');
    const submitBtnText = document.getElementById('submitBtnText');
    const submitBtnIcon = document.getElementById('submitBtnIcon');
    const resetFormBtn = document.getElementById('resetFormBtn');

    // Form inputs
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Validation helper
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const setInputState = (input, isValid) => {
        const group = input.closest('.form-group');
        if (!group) return;
        if (isValid) {
            group.classList.remove('has-error');
        } else {
            group.classList.add('has-error');
        }
    };

    // Live validation
    if (fullNameInput) {
        fullNameInput.addEventListener('input', () => {
            setInputState(fullNameInput, fullNameInput.value.trim().length >= 2);
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            setInputState(emailInput, validateEmail(emailInput.value.trim()));
        });
    }

    if (subjectInput) {
        subjectInput.addEventListener('change', () => {
            setInputState(subjectInput, subjectInput.value !== '');
        });
    }

    if (messageInput) {
        messageInput.addEventListener('input', () => {
            setInputState(messageInput, messageInput.value.trim().length >= 15);
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = fullNameInput.value.trim().length >= 2;
            const isEmailValid = validateEmail(emailInput.value.trim());
            const isSubjectValid = subjectInput.value !== '';
            const isMessageValid = messageInput.value.trim().length >= 15;

            setInputState(fullNameInput, isNameValid);
            setInputState(emailInput, isEmailValid);
            setInputState(subjectInput, isSubjectValid);
            setInputState(messageInput, isMessageValid);

            if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
                // Submit loading state
                submitBtn.disabled = true;
                submitBtnText.innerText = 'Encrypting & Transmitting...';
                submitBtnIcon.className = 'fa-solid fa-spinner fa-spin btn-icon';

                setTimeout(() => {
                    contactForm.classList.add('hidden');
                    formSuccess.classList.add('active');

                    // Generate random transmission ID
                    const txIdEl = document.getElementById('txId');
                    if (txIdEl) {
                        const randomNum = Math.floor(100000 + Math.random() * 900000);
                        txIdEl.innerText = `#NX-${randomNum}`;
                    }

                    showToast('Transmission encrypted and dispatched to Nexora core.', 'success');
                }, 1200);
            } else {
                showToast('Please rectify the highlighted form errors before transmission.', 'info');
            }
        });
    }

    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtnText.innerText = 'Transmit Message';
            submitBtnIcon.className = 'fa-solid fa-paper-plane btn-icon';
            formSuccess.classList.remove('active');
            contactForm.classList.remove('hidden');
        });
    }

    // ------------------------------------------------------------------------
    // 11. NEWSLETTER SUBSCRIPTION FORM
    // ------------------------------------------------------------------------
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterMsg = document.getElementById('newsletterMsg');

    if (newsletterForm && newsletterEmail && newsletterMsg) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterEmail.value.trim();

            if (validateEmail(email)) {
                newsletterEmail.value = '';
                newsletterMsg.style.color = '#10b981';
                newsletterMsg.innerText = '✓ Subscribed to Neural Dispatch.';
                showToast('Welcome to the Nexora Neural Dispatch bulletin.', 'success');
                setTimeout(() => {
                    newsletterMsg.innerText = '';
                }, 4000);
            } else {
                newsletterMsg.style.color = '#ef4444';
                newsletterMsg.innerText = 'Please enter a valid corporate email.';
            }
        });
    }

    // ------------------------------------------------------------------------
    // 12. BACK TO TOP BUTTON WITH CIRCULAR PROGRESS RING
    // ------------------------------------------------------------------------
    const backToTopBtn = document.getElementById('backToTopBtn');
    const progressCircle = document.querySelector('.progress-ring__circle');
    const circleRadius = 21;
    const circumference = 2 * Math.PI * circleRadius; // ~131.94

    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = `${circumference}`;
    }

    const updateScrollProgress = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;

        if (progressCircle) {
            const offset = circumference - (scrollPercent * circumference);
            progressCircle.style.strokeDashoffset = offset;
        }

        if (backToTopBtn) {
            if (scrollTop > 450) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ------------------------------------------------------------------------
    // 13. TOAST NOTIFICATION UTILITY
    // ------------------------------------------------------------------------
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message, type = 'info') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconClass = type === 'success' ? 'fa-solid fa-circle-check text-green' : 'fa-solid fa-circle-info text-cyan';

        toast.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'all 0.3s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-30px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    // ------------------------------------------------------------------------
    // 14. SIMPLE SCROLL REVEAL (AOS ALTERNATIVE FOR VANILLA JS)
    // ------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('[data-aos]');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = 110;

            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('aos-animate');
            }
        });
    };

    // Apply baseline styles for vanilla AOS
    revealElements.forEach(el => {
        el.style.transition = 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.opacity = '0';
        const effect = el.getAttribute('data-aos');
        if (effect === 'fade-up') el.style.transform = 'translateY(35px)';
        if (effect === 'fade-right') el.style.transform = 'translateX(-35px)';
        if (effect === 'fade-left') el.style.transform = 'translateX(35px)';
        if (effect === 'zoom-in') el.style.transform = 'scale(0.92)';
    });

    const triggerReveal = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.92) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
    };

    window.addEventListener('scroll', triggerReveal, { passive: true });
    // Trigger on initial page load
    triggerReveal();

});
