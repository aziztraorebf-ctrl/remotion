// Shards individuels de f5-chaos (panneau CHAOS), extraits pour animation V2 --
// chaque shard anime independamment (rotation propre + micro-flottement), au lieu
// d'un seul bloc fige. Genere par scripts/parse-chaos-shards.py.

export type ChaosShard = { tx: number; ty: number; rot: number; content: string; depth: "far" | "mid" };

export const CHAOS_BG_ELLIPSE = `<ellipse cx="460.0" cy="520.0" rx="430" ry="400" fill="#FF6B1A" opacity="0.055" filter="url(#f5-depthFar)"/>`;

export const CHAOS_FOREGROUND = `<g opacity="1.0">
<g transform="translate(330.3 484.0) rotate(137.9)"><path d="M -215.1 0 L -50.9 -19.9 L -50.9 19.9 Z" fill="url(#f5-trailW)"/><path d="M 50.9 0 L 0 27.4 L -50.9 0 L 0 -27.4 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(259.2 599.1) rotate(256.9)"><path d="M -234.6 0 L -51.4 -16.9 L -51.4 16.9 Z" fill="url(#f5-trailW)"/><path d="M 51.4 0 L 0 19.7 L -51.4 0 L 0 -19.7 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(597.6 505.7) rotate(52.5)"><path d="M -131.5 0 L -32.0 -13.1 L -32.0 13.1 Z" fill="url(#f5-trailW)"/><path d="M 32.0 0 L 0 18.9 L -32.0 0 L 0 -18.9 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(141.8 484.1) rotate(4.8)"><path d="M -235.3 0 L -52.6 -18.1 L -52.6 18.1 Z" fill="url(#f5-trailW)"/><path d="M 52.6 0 L 0 22.2 L -52.6 0 L 0 -22.2 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(245.3 704.3) rotate(233.7)"><path d="M -343.0 0 L -72.9 -21.8 L -72.9 21.8 Z" fill="url(#f5-trailW)"/><path d="M 72.9 0 L 0 23.3 L -72.9 0 L 0 -23.3 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(546.8 461.4) rotate(139.3)"><path d="M -162.0 0 L -37.4 -13.9 L -37.4 13.9 Z" fill="url(#f5-trailW)"/><path d="M 37.4 0 L 0 18.3 L -37.4 0 L 0 -18.3 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(273.7 630.8) rotate(201.6)"><path d="M -208.4 0 L -45.4 -14.6 L -45.4 14.6 Z" fill="url(#f5-trailW)"/><path d="M 45.4 0 L 0 16.8 L -45.4 0 L 0 -16.8 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(476.3 830.7) rotate(180.6)"><path d="M -228.0 0 L -47.8 -13.6 L -47.8 13.6 Z" fill="url(#f5-trailW)"/><path d="M 47.8 0 L 0 14.0 L -47.8 0 L 0 -14.0 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(423.4 201.5) rotate(196.2)"><path d="M -165.5 0 L -37.5 -13.4 L -37.5 13.4 Z" fill="url(#f5-trailW)"/><path d="M 37.5 0 L 0 16.9 L -37.5 0 L 0 -16.9 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(533.4 821.4) rotate(8.5)"><path d="M -312.0 0 L -67.4 -21.3 L -67.4 21.3 Z" fill="url(#f5-trailW)"/><path d="M 67.4 0 L 0 23.9 L -67.4 0 L 0 -23.9 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(519.8 527.2) rotate(97.4)"><path d="M -271.6 0 L -56.9 -16.1 L -56.9 16.1 Z" fill="url(#f5-trailO)"/><path d="M 56.9 0 L 0 16.4 L -56.9 0 L 0 -16.4 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(158.3 548.5) rotate(223.1)"><path d="M -275.6 0 L -62.6 -22.5 L -62.6 22.5 Z" fill="url(#f5-trailW)"/><path d="M 62.6 0 L 0 28.7 L -62.6 0 L 0 -28.7 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(639.0 451.9) rotate(145.4)"><path d="M -216.3 0 L -47.1 -15.2 L -47.1 15.2 Z" fill="url(#f5-trailW)"/><path d="M 47.1 0 L 0 17.4 L -47.1 0 L 0 -17.4 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(438.4 429.1) rotate(344.3)"><path d="M -280.9 0 L -59.4 -17.3 L -59.4 17.3 Z" fill="url(#f5-trailW)"/><path d="M 59.4 0 L 0 18.2 L -59.4 0 L 0 -18.2 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(593.5 691.6) rotate(219.9)"><path d="M -217.4 0 L -50.8 -19.4 L -50.8 19.4 Z" fill="url(#f5-trailW)"/><path d="M 50.8 0 L 0 26.0 L -50.8 0 L 0 -26.0 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(210.5 399.0) rotate(252.2)"><path d="M -249.5 0 L -55.7 -19.2 L -55.7 19.2 Z" fill="url(#f5-trailW)"/><path d="M 55.7 0 L 0 23.5 L -55.7 0 L 0 -23.5 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(423.5 583.8) rotate(201.2)"><path d="M -254.1 0 L -55.0 -17.3 L -55.0 17.3 Z" fill="url(#f5-trailW)"/><path d="M 55.0 0 L 0 19.6 L -55.0 0 L 0 -19.6 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(455.3 474.9) rotate(186.8)"><path d="M -138.8 0 L -34.8 -15.0 L -34.8 15.0 Z" fill="url(#f5-trailW)"/><path d="M 34.8 0 L 0 22.4 L -34.8 0 L 0 -22.4 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(683.0 747.8) rotate(329.1)"><path d="M -232.2 0 L -54.9 -21.4 L -54.9 21.4 Z" fill="url(#f5-trailW)"/><path d="M 54.9 0 L 0 29.4 L -54.9 0 L 0 -29.4 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(672.3 269.6) rotate(28.0)"><path d="M -195.3 0 L -44.4 -16.0 L -44.4 16.0 Z" fill="url(#f5-trailW)"/><path d="M 44.4 0 L 0 20.3 L -44.4 0 L 0 -20.3 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(484.1 761.3) rotate(123.6)"><path d="M -422.3 0 L -88.4 -24.9 L -88.4 24.9 Z" fill="url(#f5-trailW)"/><path d="M 88.4 0 L 0 25.4 L -88.4 0 L 0 -25.4 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
<g transform="translate(409.8 483.6) rotate(15.9)"><path d="M -278.6 0 L -57.6 -15.3 L -57.6 15.3 Z" fill="url(#f5-trailW)"/><path d="M 57.6 0 L 0 14.9 L -57.6 0 L 0 -14.9 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g>
</g>
<g opacity="0.95"><g transform="translate(120.0 150.0) rotate(34.0)"><path d="M -548.5 0 L -115.1 -32.7 L -115.1 32.7 Z" fill="url(#f5-trailW)"/><path d="M 115.1 0 L 0 33.5 L -115.1 0 L 0 -33.5 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g></g>
<g opacity="0.95"><g transform="translate(170.0 940.0) rotate(-28.0)"><path d="M -411.5 0 L -88.5 -27.5 L -88.5 27.5 Z" fill="url(#f5-trailO)"/><path d="M 88.5 0 L 0 30.6 L -88.5 0 L 0 -30.6 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="2.2"/></g></g>
<g opacity="0.95"><g transform="translate(760.0 130.0) rotate(118.0)"><path d="M -409.5 0 L -87.3 -26.3 L -87.3 26.3 Z" fill="url(#f5-trailW)"/><path d="M 87.3 0 L 0 28.4 L -87.3 0 L 0 -28.4 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g></g>
<g opacity="0.95"><g transform="translate(60.0 560.0) rotate(8.0)"><path d="M -520.4 0 L -108.4 -29.9 L -108.4 29.9 Z" fill="url(#f5-trailO)"/><path d="M 108.4 0 L 0 29.9 L -108.4 0 L 0 -29.9 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="2.2"/></g></g>
<g opacity="0.95"><g transform="translate(700.0 960.0) rotate(-70.0)"><path d="M -349.7 0 L -76.0 -24.3 L -76.0 24.3 Z" fill="url(#f5-trailW)"/><path d="M 76.0 0 L 0 27.8 L -76.0 0 L 0 -27.8 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g></g>
<g opacity="0.95"><g transform="translate(330.0 60.0) rotate(62.0)"><path d="M -476.8 0 L -100.8 -29.5 L -100.8 29.5 Z" fill="url(#f5-trailO)"/><path d="M 100.8 0 L 0 31.0 L -100.8 0 L 0 -31.0 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="2.2"/></g></g>
<g opacity="0.95"><g transform="translate(830.0 620.0) rotate(-104.0)"><path d="M -346.6 0 L -74.6 -23.2 L -74.6 23.2 Z" fill="url(#f5-trailW)"/><path d="M 74.6 0 L 0 25.7 L -74.6 0 L 0 -25.7 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g></g>
<g opacity="0.95"><g transform="translate(40.0 300.0) rotate(20.0)"><path d="M -448.7 0 L -94.1 -26.7 L -94.1 26.7 Z" fill="url(#f5-trailW)"/><path d="M 94.1 0 L 0 27.4 L -94.1 0 L 0 -27.4 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2.2"/></g></g>
<g stroke-linecap="round">
<line x1="336.9" y1="861.9" x2="320.0" y2="860.5" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1.8"/>
<line x1="593.2" y1="507.0" x2="556.2" y2="508.9" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.0"/>
<line x1="754.5" y1="693.3" x2="737.5" y2="749.1" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="2.2"/>
<line x1="211.3" y1="168.0" x2="180.7" y2="221.1" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="0.9"/>
<line x1="732.3" y1="351.7" x2="726.2" y2="369.9" stroke="#FF6B1A" stroke-opacity="0.1" stroke-width="1.4"/>
<line x1="572.1" y1="125.7" x2="589.6" y2="136.4" stroke="#FF6B1A" stroke-opacity="0.3" stroke-width="1.6"/>
<line x1="489.4" y1="847.9" x2="472.8" y2="884.7" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.6"/>
<line x1="901.3" y1="570.3" x2="874.7" y2="555.4" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1.8"/>
<line x1="306.2" y1="814.8" x2="288.2" y2="853.2" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2.1"/>
<line x1="773.0" y1="430.6" x2="739.1" y2="461.5" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2.3"/>
<line x1="470.6" y1="739.2" x2="470.9" y2="758.4" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2.2"/>
<line x1="198.6" y1="349.3" x2="219.3" y2="336.4" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.9"/>
<line x1="393.0" y1="201.9" x2="368.6" y2="210.7" stroke="#FF6B1A" stroke-opacity="0.3" stroke-width="1.2"/>
<line x1="154.5" y1="534.6" x2="160.6" y2="562.9" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="2.3"/>
<line x1="142.9" y1="443.4" x2="153.0" y2="386.1" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="0.9"/>
<line x1="65.4" y1="618.2" x2="43.7" y2="629.7" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1.4"/>
<line x1="346.6" y1="290.6" x2="300.1" y2="321.8" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2.1"/>
<line x1="782.4" y1="646.4" x2="805.2" y2="608.9" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="2.2"/>
<line x1="502.5" y1="542.0" x2="507.2" y2="579.5" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1.2"/>
<line x1="410.1" y1="115.3" x2="404.5" y2="67.3" stroke="#FF6B1A" stroke-opacity="0.2" stroke-width="1.3"/>
<line x1="772.4" y1="690.2" x2="797.8" y2="690.9" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="2.4"/>
<line x1="268.3" y1="509.2" x2="282.1" y2="449.2" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1.9"/>
<line x1="322.0" y1="472.6" x2="360.2" y2="504.6" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1.6"/>
<line x1="120.2" y1="478.7" x2="135.3" y2="523.1" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1.4"/>
<line x1="348.1" y1="364.5" x2="391.9" y2="366.3" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2.0"/>
<line x1="818.5" y1="685.4" x2="763.9" y2="699.5" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1.1"/>
<line x1="402.3" y1="739.4" x2="374.3" y2="788.2" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2.3"/>
<line x1="32.0" y1="670.1" x2="42.1" y2="643.2" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.2"/>
<line x1="588.8" y1="885.8" x2="583.3" y2="870.3" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1.3"/>
<line x1="333.7" y1="862.9" x2="310.7" y2="906.7" stroke="#FF6B1A" stroke-opacity="0.2" stroke-width="1.7"/>
<line x1="518.1" y1="233.0" x2="565.3" y2="270.2" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.0"/>
<line x1="595.3" y1="354.3" x2="593.2" y2="332.8" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="2.0"/>
<line x1="43.8" y1="567.7" x2="62.3" y2="580.6" stroke="#FF6B1A" stroke-opacity="0.2" stroke-width="1.0"/>
<line x1="159.8" y1="354.5" x2="175.9" y2="320.0" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1.3"/>
<line x1="870.0" y1="386.7" x2="850.1" y2="387.6" stroke="#FF6B1A" stroke-opacity="0.2" stroke-width="1.6"/>
<line x1="439.4" y1="231.3" x2="421.1" y2="224.3" stroke="#FF6B1A" stroke-opacity="0.2" stroke-width="1.9"/>
<line x1="499.5" y1="333.3" x2="535.3" y2="292.1" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="2.0"/>
<line x1="148.8" y1="732.1" x2="191.2" y2="696.2" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.6"/>
<line x1="812.5" y1="513.6" x2="787.3" y2="487.2" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="0.9"/>
<line x1="418.8" y1="735.3" x2="451.1" y2="783.1" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1.3"/>
<line x1="712.9" y1="753.4" x2="727.7" y2="729.1" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.6"/>
<line x1="526.6" y1="627.9" x2="530.0" y2="648.9" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.1"/>
<line x1="843.4" y1="508.1" x2="810.3" y2="480.0" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2.2"/>
<line x1="774.1" y1="604.9" x2="773.1" y2="635.4" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1.8"/>
<line x1="666.8" y1="868.2" x2="665.4" y2="886.2" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2.3"/>
<line x1="627.4" y1="304.6" x2="660.3" y2="349.4" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1.5"/>
<line x1="691.3" y1="627.0" x2="744.9" y2="648.3" stroke="#FF6B1A" stroke-opacity="0.1" stroke-width="1.8"/>
<line x1="846.6" y1="329.3" x2="834.4" y2="310.3" stroke="#FF6B1A" stroke-opacity="0.2" stroke-width="1.3"/>
<line x1="467.9" y1="294.9" x2="450.9" y2="256.1" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2.3"/>
<line x1="770.7" y1="817.8" x2="799.2" y2="868.6" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.6"/>
<line x1="396.9" y1="616.4" x2="381.7" y2="643.4" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.0"/>
<line x1="293.0" y1="353.7" x2="324.8" y2="389.1" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.1"/>
<line x1="651.6" y1="695.5" x2="623.7" y2="696.1" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1.1"/>
<line x1="340.1" y1="715.2" x2="353.1" y2="752.3" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5"/>
<line x1="255.7" y1="664.2" x2="239.0" y2="674.3" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.1"/>
<line x1="749.3" y1="487.4" x2="806.5" y2="473.3" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.6"/>
<line x1="602.0" y1="264.2" x2="623.2" y2="302.3" stroke="#FF6B1A" stroke-opacity="0.2" stroke-width="0.8"/>
<line x1="698.0" y1="466.9" x2="651.4" y2="484.7" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="2.1"/>
<line x1="393.0" y1="468.7" x2="342.4" y2="475.2" stroke="#FF6B1A" stroke-opacity="0.1" stroke-width="1.6"/>
<line x1="422.7" y1="214.6" x2="442.2" y2="249.2" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="2.2"/>
<line x1="461.6" y1="660.0" x2="487.4" y2="689.1" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2.3"/>
<line x1="632.7" y1="450.4" x2="680.1" y2="440.6" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2.4"/>
<line x1="748.7" y1="471.4" x2="767.1" y2="486.4" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="2.2"/>
<line x1="644.2" y1="832.5" x2="618.8" y2="849.2" stroke="#FF6B1A" stroke-opacity="0.1" stroke-width="1.7"/>
<line x1="718.0" y1="254.3" x2="692.4" y2="293.7" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="2.2"/>
<line x1="16.5" y1="631.2" x2="49.8" y2="609.7" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="2.3"/>
<line x1="433.8" y1="488.0" x2="442.7" y2="506.5" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1.8"/>
<line x1="304.3" y1="810.3" x2="261.8" y2="805.1" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1.1"/>
<line x1="631.0" y1="646.0" x2="595.8" y2="649.6" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="0.9"/>
<line x1="94.9" y1="296.6" x2="60.0" y2="336.6" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2.3"/>
</g>`;

export const CHAOS_SHARDS: ChaosShard[] = [
  { tx: 98.6, ty: 700.1, rot: 341.6, depth: "far", content: `<path d="M -63.1 0 L -15.5 -6.4 L -15.5 6.4 Z" fill="url(#f5-trailW)"/><path d="M 15.5 0 L 0 9.3 L -15.5 0 L 0 -9.3 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 410.4, ty: 299.0, rot: 47.2, depth: "far", content: `<path d="M -71.8 0 L -15.8 -5.2 L -15.8 5.2 Z" fill="url(#f5-trailW)"/><path d="M 15.8 0 L 0 6.1 L -15.8 0 L 0 -6.1 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 851.3, ty: 530.8, rot: 269.5, depth: "far", content: `<path d="M -79.8 0 L -17.4 -5.7 L -17.4 5.7 Z" fill="url(#f5-trailW)"/><path d="M 17.4 0 L 0 6.6 L -17.4 0 L 0 -6.6 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 268.8, ty: 362.6, rot: 48.5, depth: "far", content: `<path d="M -80.0 0 L -17.4 -5.6 L -17.4 5.6 Z" fill="url(#f5-trailW)"/><path d="M 17.4 0 L 0 6.4 L -17.4 0 L 0 -6.4 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 701.3, ty: 323.4, rot: 224.1, depth: "far", content: `<path d="M -120.4 0 L -24.9 -6.7 L -24.9 6.7 Z" fill="url(#f5-trailW)"/><path d="M 24.9 0 L 0 6.6 L -24.9 0 L 0 -6.6 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 668.3, ty: 765.0, rot: 196.4, depth: "far", content: `<path d="M -99.2 0 L -20.5 -5.5 L -20.5 5.5 Z" fill="url(#f5-trailW)"/><path d="M 20.5 0 L 0 5.4 L -20.5 0 L 0 -5.4 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 401.9, ty: 140.1, rot: 85.3, depth: "far", content: `<path d="M -67.8 0 L -14.0 -3.8 L -14.0 3.8 Z" fill="url(#f5-trailW)"/><path d="M 14.0 0 L 0 3.7 L -14.0 0 L 0 -3.7 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 811.3, ty: 455.4, rot: 11.0, depth: "far", content: `<path d="M -71.7 0 L -16.9 -6.6 L -16.9 6.6 Z" fill="url(#f5-trailO)"/><path d="M 16.9 0 L 0 9.0 L -16.9 0 L 0 -9.0 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 532.5, ty: 726.9, rot: 93.2, depth: "far", content: `<path d="M -43.4 0 L -10.3 -4.1 L -10.3 4.1 Z" fill="url(#f5-trailO)"/><path d="M 10.3 0 L 0 5.6 L -10.3 0 L 0 -5.6 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 466.8, ty: 355.5, rot: 92.2, depth: "far", content: `<path d="M -51.6 0 L -12.4 -5.0 L -12.4 5.0 Z" fill="url(#f5-trailW)"/><path d="M 12.4 0 L 0 7.1 L -12.4 0 L 0 -7.1 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 818.9, ty: 455.1, rot: 127.8, depth: "far", content: `<path d="M -98.8 0 L -21.9 -7.4 L -21.9 7.4 Z" fill="url(#f5-trailO)"/><path d="M 21.9 0 L 0 8.9 L -21.9 0 L 0 -8.9 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 671.9, ty: 892.1, rot: 320.1, depth: "far", content: `<path d="M -94.5 0 L -21.2 -7.4 L -21.2 7.4 Z" fill="url(#f5-trailW)"/><path d="M 21.2 0 L 0 9.1 L -21.2 0 L 0 -9.1 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 363.6, ty: 240.6, rot: 69.1, depth: "far", content: `<path d="M -83.2 0 L -18.9 -6.8 L -18.9 6.8 Z" fill="url(#f5-trailW)"/><path d="M 18.9 0 L 0 8.7 L -18.9 0 L 0 -8.7 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 721.9, ty: 310.9, rot: 214.7, depth: "far", content: `<path d="M -114.4 0 L -24.6 -7.7 L -24.6 7.7 Z" fill="url(#f5-trailW)"/><path d="M 24.6 0 L 0 8.5 L -24.6 0 L 0 -8.5 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 768.1, ty: 637.6, rot: 157.0, depth: "far", content: `<path d="M -85.7 0 L -18.7 -6.1 L -18.7 6.1 Z" fill="url(#f5-trailO)"/><path d="M 18.7 0 L 0 7.0 L -18.7 0 L 0 -7.0 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 100.8, ty: 382.4, rot: 15.9, depth: "far", content: `<path d="M -52.7 0 L -11.7 -4.0 L -11.7 4.0 Z" fill="url(#f5-trailW)"/><path d="M 11.7 0 L 0 4.8 L -11.7 0 L 0 -4.8 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 405.2, ty: 252.6, rot: 271.5, depth: "far", content: `<path d="M -116.3 0 L -24.8 -7.4 L -24.8 7.4 Z" fill="url(#f5-trailW)"/><path d="M 24.8 0 L 0 8.0 L -24.8 0 L 0 -8.0 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 781.8, ty: 198.6, rot: 323.8, depth: "far", content: `<path d="M -61.8 0 L -13.4 -4.2 L -13.4 4.2 Z" fill="url(#f5-trailW)"/><path d="M 13.4 0 L 0 4.8 L -13.4 0 L 0 -4.8 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 229.0, ty: 850.9, rot: 292.8, depth: "far", content: `<path d="M -65.0 0 L -14.4 -4.9 L -14.4 4.9 Z" fill="url(#f5-trailO)"/><path d="M 14.4 0 L 0 5.8 L -14.4 0 L 0 -5.8 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 275.6, ty: 551.5, rot: 298.4, depth: "far", content: `<path d="M -104.4 0 L -22.3 -6.7 L -22.3 6.7 Z" fill="url(#f5-trailW)"/><path d="M 22.3 0 L 0 7.3 L -22.3 0 L 0 -7.3 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 207.8, ty: 369.7, rot: 100.7, depth: "far", content: `<path d="M -88.6 0 L -19.3 -6.3 L -19.3 6.3 Z" fill="url(#f5-trailW)"/><path d="M 19.3 0 L 0 7.2 L -19.3 0 L 0 -7.2 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 889.4, ty: 611.0, rot: 179.6, depth: "far", content: `<path d="M -66.9 0 L -15.0 -5.3 L -15.0 5.3 Z" fill="url(#f5-trailW)"/><path d="M 15.0 0 L 0 6.6 L -15.0 0 L 0 -6.6 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 744.9, ty: 829.4, rot: 295.3, depth: "far", content: `<path d="M -81.1 0 L -17.6 -5.6 L -17.6 5.6 Z" fill="url(#f5-trailW)"/><path d="M 17.6 0 L 0 6.3 L -17.6 0 L 0 -6.3 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 509.1, ty: 892.6, rot: 207.5, depth: "far", content: `<path d="M -46.3 0 L -10.4 -3.6 L -10.4 3.6 Z" fill="url(#f5-trailO)"/><path d="M 10.4 0 L 0 4.4 L -10.4 0 L 0 -4.4 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 200.8, ty: 201.3, rot: 36.5, depth: "far", content: `<path d="M -57.8 0 L -13.6 -5.2 L -13.6 5.2 Z" fill="url(#f5-trailO)"/><path d="M 13.6 0 L 0 7.0 L -13.6 0 L 0 -7.0 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 403.5, ty: 228.1, rot: 262.1, depth: "far", content: `<path d="M -51.1 0 L -11.5 -4.0 L -11.5 4.0 Z" fill="url(#f5-trailO)"/><path d="M 11.5 0 L 0 5.0 L -11.5 0 L 0 -5.0 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 568.3, ty: 97.0, rot: 284.4, depth: "far", content: `<path d="M -49.5 0 L -11.8 -4.6 L -11.8 4.6 Z" fill="url(#f5-trailO)"/><path d="M 11.8 0 L 0 6.4 L -11.8 0 L 0 -6.4 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 639.7, ty: 849.8, rot: 223.4, depth: "far", content: `<path d="M -39.1 0 L -10.2 -4.6 L -10.2 4.6 Z" fill="url(#f5-trailW)"/><path d="M 10.2 0 L 0 7.2 L -10.2 0 L 0 -7.2 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 541.6, ty: 949.5, rot: 199.0, depth: "far", content: `<path d="M -59.3 0 L -14.5 -6.0 L -14.5 6.0 Z" fill="url(#f5-trailW)"/><path d="M 14.5 0 L 0 8.7 L -14.5 0 L 0 -8.7 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 449.5, ty: 679.1, rot: 331.3, depth: "far", content: `<path d="M -114.9 0 L -23.8 -6.4 L -23.8 6.4 Z" fill="url(#f5-trailO)"/><path d="M 23.8 0 L 0 6.2 L -23.8 0 L 0 -6.2 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 214.5, ty: 305.0, rot: 20.2, depth: "far", content: `<path d="M -78.3 0 L -16.7 -5.0 L -16.7 5.0 Z" fill="url(#f5-trailW)"/><path d="M 16.7 0 L 0 5.4 L -16.7 0 L 0 -5.4 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 262.7, ty: 301.3, rot: 105.8, depth: "far", content: `<path d="M -79.9 0 L -16.8 -4.8 L -16.8 4.8 Z" fill="url(#f5-trailW)"/><path d="M 16.8 0 L 0 4.9 L -16.8 0 L 0 -4.9 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 330.0, ty: 357.1, rot: 348.1, depth: "far", content: `<path d="M -94.5 0 L -20.6 -6.7 L -20.6 6.7 Z" fill="url(#f5-trailO)"/><path d="M 20.6 0 L 0 7.7 L -20.6 0 L 0 -7.7 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 682.1, ty: 497.5, rot: 147.1, depth: "far", content: `<path d="M -43.0 0 L -9.9 -3.7 L -9.9 3.7 Z" fill="url(#f5-trailO)"/><path d="M 9.9 0 L 0 4.9 L -9.9 0 L 0 -4.9 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 875.3, ty: 455.7, rot: 342.7, depth: "far", content: `<path d="M -75.6 0 L -17.2 -6.2 L -17.2 6.2 Z" fill="url(#f5-trailO)"/><path d="M 17.2 0 L 0 7.8 L -17.2 0 L 0 -7.8 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 668.7, ty: 464.3, rot: 335.0, depth: "far", content: `<path d="M -57.1 0 L -14.3 -6.1 L -14.3 6.1 Z" fill="url(#f5-trailW)"/><path d="M 14.3 0 L 0 9.1 L -14.3 0 L 0 -9.1 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 429.7, ty: 926.9, rot: 243.9, depth: "far", content: `<path d="M -122.2 0 L -25.6 -7.3 L -25.6 7.3 Z" fill="url(#f5-trailW)"/><path d="M 25.6 0 L 0 7.4 L -25.6 0 L 0 -7.4 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 476.5, ty: 612.7, rot: 189.6, depth: "far", content: `<path d="M -65.4 0 L -13.7 -3.8 L -13.7 3.8 Z" fill="url(#f5-trailW)"/><path d="M 13.7 0 L 0 3.8 L -13.7 0 L 0 -3.8 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 532.0, ty: 656.4, rot: 291.9, depth: "far", content: `<path d="M -97.5 0 L -21.3 -6.9 L -21.3 6.9 Z" fill="url(#f5-trailW)"/><path d="M 21.3 0 L 0 7.9 L -21.3 0 L 0 -7.9 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 167.1, ty: 596.8, rot: 310.8, depth: "far", content: `<path d="M -54.2 0 L -12.8 -4.9 L -12.8 4.9 Z" fill="url(#f5-trailW)"/><path d="M 12.8 0 L 0 6.7 L -12.8 0 L 0 -6.7 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 279.6, ty: 655.4, rot: 6.4, depth: "far", content: `<path d="M -48.8 0 L -11.4 -4.4 L -11.4 4.4 Z" fill="url(#f5-trailW)"/><path d="M 11.4 0 L 0 5.9 L -11.4 0 L 0 -5.9 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 268.4, ty: 912.0, rot: 218.7, depth: "far", content: `<path d="M -122.8 0 L -25.4 -6.8 L -25.4 6.8 Z" fill="url(#f5-trailW)"/><path d="M 25.4 0 L 0 6.6 L -25.4 0 L 0 -6.6 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 52.1, ty: 350.2, rot: 347.7, depth: "far", content: `<path d="M -112.1 0 L -24.3 -7.7 L -24.3 7.7 Z" fill="url(#f5-trailW)"/><path d="M 24.3 0 L 0 8.7 L -24.3 0 L 0 -8.7 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 182.8, ty: 560.3, rot: 153.3, depth: "far", content: `<path d="M -79.4 0 L -17.3 -5.5 L -17.3 5.5 Z" fill="url(#f5-trailO)"/><path d="M 17.3 0 L 0 6.3 L -17.3 0 L 0 -6.3 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 180.6, ty: 782.6, rot: 115.6, depth: "far", content: `<path d="M -55.7 0 L -13.2 -5.2 L -13.2 5.2 Z" fill="url(#f5-trailO)"/><path d="M 13.2 0 L 0 7.2 L -13.2 0 L 0 -7.2 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 259.9, ty: 393.2, rot: 354.5, depth: "far", content: `<path d="M -96.2 0 L -20.1 -5.6 L -20.1 5.6 Z" fill="url(#f5-trailW)"/><path d="M 20.1 0 L 0 5.6 L -20.1 0 L 0 -5.6 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.0"/>` },
  { tx: 203.8, ty: 556.4, rot: 270.1, depth: "mid", content: `<path d="M -193.0 0 L -40.5 -11.5 L -40.5 11.5 Z" fill="url(#f5-trailW)"/><path d="M 40.5 0 L 0 11.7 L -40.5 0 L 0 -11.7 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 314.8, ty: 713.7, rot: 342.4, depth: "mid", content: `<path d="M -109.4 0 L -24.5 -8.5 L -24.5 8.5 Z" fill="url(#f5-trailW)"/><path d="M 24.5 0 L 0 10.4 L -24.5 0 L 0 -10.4 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 150.5, ty: 445.2, rot: 331.4, depth: "mid", content: `<path d="M -94.6 0 L -24.4 -10.9 L -24.4 10.9 Z" fill="url(#f5-trailO)"/><path d="M 24.4 0 L 0 16.8 L -24.4 0 L 0 -16.8 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 274.5, ty: 656.3, rot: 357.0, depth: "mid", content: `<path d="M -216.3 0 L -44.6 -11.7 L -44.6 11.7 Z" fill="url(#f5-trailW)"/><path d="M 44.6 0 L 0 11.2 L -44.6 0 L 0 -11.2 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 497.3, ty: 900.2, rot: 179.3, depth: "mid", content: `<path d="M -189.3 0 L -41.3 -13.3 L -41.3 13.3 Z" fill="url(#f5-trailO)"/><path d="M 41.3 0 L 0 15.4 L -41.3 0 L 0 -15.4 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 151.2, ty: 720.0, rot: 278.3, depth: "mid", content: `<path d="M -66.4 0 L -16.3 -6.8 L -16.3 6.8 Z" fill="url(#f5-trailW)"/><path d="M 16.3 0 L 0 9.9 L -16.3 0 L 0 -9.9 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 485.2, ty: 678.0, rot: 53.9, depth: "mid", content: `<path d="M -78.6 0 L -20.2 -9.0 L -20.2 9.0 Z" fill="url(#f5-trailW)"/><path d="M 20.2 0 L 0 14.0 L -20.2 0 L 0 -14.0 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 731.6, ty: 587.2, rot: 346.2, depth: "mid", content: `<path d="M -150.9 0 L -32.7 -10.3 L -32.7 10.3 Z" fill="url(#f5-trailW)"/><path d="M 32.7 0 L 0 11.7 L -32.7 0 L 0 -11.7 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 632.2, ty: 861.8, rot: 195.1, depth: "mid", content: `<path d="M -80.8 0 L -19.7 -8.1 L -19.7 8.1 Z" fill="url(#f5-trailW)"/><path d="M 19.7 0 L 0 11.7 L -19.7 0 L 0 -11.7 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 870.5, ty: 465.6, rot: 80.7, depth: "mid", content: `<path d="M -68.7 0 L -17.8 -8.0 L -17.8 8.0 Z" fill="url(#f5-trailW)"/><path d="M 17.8 0 L 0 12.5 L -17.8 0 L 0 -12.5 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 495.8, ty: 158.9, rot: 123.0, depth: "mid", content: `<path d="M -194.2 0 L -42.3 -13.7 L -42.3 13.7 Z" fill="url(#f5-trailW)"/><path d="M 42.3 0 L 0 15.8 L -42.3 0 L 0 -15.8 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 758.6, ty: 247.5, rot: 82.0, depth: "mid", content: `<path d="M -79.6 0 L -20.0 -8.7 L -20.0 8.7 Z" fill="url(#f5-trailO)"/><path d="M 20.0 0 L 0 13.0 L -20.0 0 L 0 -13.0 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 251.1, ty: 273.5, rot: 77.6, depth: "mid", content: `<path d="M -146.7 0 L -30.4 -8.1 L -30.4 8.1 Z" fill="url(#f5-trailW)"/><path d="M 30.4 0 L 0 7.9 L -30.4 0 L 0 -7.9 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 313.5, ty: 613.1, rot: 229.9, depth: "mid", content: `<path d="M -118.2 0 L -26.4 -9.1 L -26.4 9.1 Z" fill="url(#f5-trailW)"/><path d="M 26.4 0 L 0 11.2 L -26.4 0 L 0 -11.2 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 48.0, ty: 550.0, rot: 298.8, depth: "mid", content: `<path d="M -194.1 0 L -40.2 -10.8 L -40.2 10.8 Z" fill="url(#f5-trailW)"/><path d="M 40.2 0 L 0 10.5 L -40.2 0 L 0 -10.5 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 488.1, ty: 709.5, rot: 44.5, depth: "mid", content: `<path d="M -209.2 0 L -44.2 -13.0 L -44.2 13.0 Z" fill="url(#f5-trailW)"/><path d="M 44.2 0 L 0 13.7 L -44.2 0 L 0 -13.7 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 728.4, ty: 456.5, rot: 306.7, depth: "mid", content: `<path d="M -115.0 0 L -27.3 -10.7 L -27.3 10.7 Z" fill="url(#f5-trailO)"/><path d="M 27.3 0 L 0 14.7 L -27.3 0 L 0 -14.7 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 844.9, ty: 555.2, rot: 125.7, depth: "mid", content: `<path d="M -157.7 0 L -33.6 -10.1 L -33.6 10.1 Z" fill="url(#f5-trailO)"/><path d="M 33.6 0 L 0 10.9 L -33.6 0 L 0 -10.9 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 410.7, ty: 179.2, rot: 341.3, depth: "mid", content: `<path d="M -127.8 0 L -28.3 -9.5 L -28.3 9.5 Z" fill="url(#f5-trailO)"/><path d="M 28.3 0 L 0 11.3 L -28.3 0 L 0 -11.3 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 162.1, ty: 643.3, rot: 353.6, depth: "mid", content: `<path d="M -253.8 0 L -52.5 -14.0 L -52.5 14.0 Z" fill="url(#f5-trailO)"/><path d="M 52.5 0 L 0 13.7 L -52.5 0 L 0 -13.7 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 133.7, ty: 595.7, rot: 282.6, depth: "mid", content: `<path d="M -105.9 0 L -24.0 -8.6 L -24.0 8.6 Z" fill="url(#f5-trailW)"/><path d="M 24.0 0 L 0 10.9 L -24.0 0 L 0 -10.9 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 576.0, ty: 659.8, rot: 248.2, depth: "mid", content: `<path d="M -116.2 0 L -28.5 -11.8 L -28.5 11.8 Z" fill="url(#f5-trailW)"/><path d="M 28.5 0 L 0 17.2 L -28.5 0 L 0 -17.2 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 612.6, ty: 231.6, rot: 10.5, depth: "mid", content: `<path d="M -102.8 0 L -22.4 -7.2 L -22.4 7.2 Z" fill="url(#f5-trailO)"/><path d="M 22.4 0 L 0 8.3 L -22.4 0 L 0 -8.3 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 568.9, ty: 314.8, rot: 49.4, depth: "mid", content: `<path d="M -145.8 0 L -30.0 -7.9 L -30.0 7.9 Z" fill="url(#f5-trailW)"/><path d="M 30.0 0 L 0 7.6 L -30.0 0 L 0 -7.6 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 143.2, ty: 556.9, rot: 125.0, depth: "mid", content: `<path d="M -148.4 0 L -31.6 -9.4 L -31.6 9.4 Z" fill="url(#f5-trailW)"/><path d="M 31.6 0 L 0 10.1 L -31.6 0 L 0 -10.1 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 700.2, ty: 750.8, rot: 357.3, depth: "mid", content: `<path d="M -63.7 0 L -15.9 -6.8 L -15.9 6.8 Z" fill="url(#f5-trailW)"/><path d="M 15.9 0 L 0 10.0 L -15.9 0 L 0 -10.0 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 800.2, ty: 749.9, rot: 146.3, depth: "mid", content: `<path d="M -165.5 0 L -36.6 -12.3 L -36.6 12.3 Z" fill="url(#f5-trailW)"/><path d="M 36.6 0 L 0 14.7 L -36.6 0 L 0 -14.7 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 412.4, ty: 163.1, rot: 331.9, depth: "mid", content: `<path d="M -110.4 0 L -26.5 -10.6 L -26.5 10.6 Z" fill="url(#f5-trailW)"/><path d="M 26.5 0 L 0 14.8 L -26.5 0 L 0 -14.8 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 268.3, ty: 759.7, rot: 314.2, depth: "mid", content: `<path d="M -107.7 0 L -23.5 -7.6 L -23.5 7.6 Z" fill="url(#f5-trailW)"/><path d="M 23.5 0 L 0 8.7 L -23.5 0 L 0 -8.7 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 372.4, ty: 793.3, rot: 213.1, depth: "mid", content: `<path d="M -184.3 0 L -38.2 -10.3 L -38.2 10.3 Z" fill="url(#f5-trailO)"/><path d="M 38.2 0 L 0 10.1 L -38.2 0 L 0 -10.1 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 508.3, ty: 486.7, rot: 148.8, depth: "mid", content: `<path d="M -198.6 0 L -43.0 -13.6 L -43.0 13.6 Z" fill="url(#f5-trailO)"/><path d="M 43.0 0 L 0 15.4 L -43.0 0 L 0 -15.4 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 190.2, ty: 534.9, rot: 241.0, depth: "mid", content: `<path d="M -267.1 0 L -55.2 -14.7 L -55.2 14.7 Z" fill="url(#f5-trailW)"/><path d="M 55.2 0 L 0 14.3 L -55.2 0 L 0 -14.3 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 104.1, ty: 735.9, rot: 250.0, depth: "mid", content: `<path d="M -141.5 0 L -33.1 -12.6 L -33.1 12.6 Z" fill="url(#f5-trailO)"/><path d="M 33.1 0 L 0 17.0 L -33.1 0 L 0 -17.0 Z" fill="url(#f5-shardO)" stroke="#FF6B1A" stroke-opacity="0.9" stroke-width="1.6"/>` },
  { tx: 611.5, ty: 503.8, rot: 295.6, depth: "mid", content: `<path d="M -143.7 0 L -29.8 -8.0 L -29.8 8.0 Z" fill="url(#f5-trailW)"/><path d="M 29.8 0 L 0 7.9 L -29.8 0 L 0 -7.9 Z" fill="url(#f5-shardW)" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.6"/>` },
];