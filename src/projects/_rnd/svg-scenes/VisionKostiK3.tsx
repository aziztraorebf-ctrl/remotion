import {useCurrentFrame, AbsoluteFill} from "remotion";
// R&D 2026-07-17 — Vision K3 (0.435$) : couche narrative INVENTEE sur coquille nue.
export const VisionKostiK3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: "#d9c092"}}>
      <svg viewBox="0 0 1920 1080" width="1920" height="1080">
        
  <defs>
    <pattern id="dotted-grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.5" fill="#856f54" opacity="0.24"/>
    </pattern>

    <pattern id="fine-grid" x="0" y="0" width="192" height="192" patternUnits="userSpaceOnUse">
      <path d="M192 0H0V192" fill="none" stroke="#725d47" strokeWidth="1.5" opacity="0.17"/>
    </pattern>

    <filter id="paper-grain" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="21" result="noise"/>
      <feColorMatrix in="noise" type="saturate" values="0" result="grayNoise"/>
      <feComponentTransfer in="grayNoise" result="softNoise">
        <feFuncA type="table" tableValues="0 0.055"/>
      </feComponentTransfer>
      <feBlend in="SourceGraphic" in2="softNoise" mode="multiply"/>
    </filter>
  </defs>

  <rect x="0" y="0" width="1920" height="1080" fill="#d9c092"/>
  <rect x="0" y="0" width="1920" height="1080" fill="#d9c092" filter="url(#paper-grain)"/>
  <rect x="28" y="28" width="1864" height="1024" fill="url(#dotted-grid)"/>
  <rect x="28" y="28" width="1864" height="1024" fill="url(#fine-grid)"/>

  

  

  <g id="access-road">
    <path d="M250 895 C420 831 527 751 613 668 C682 602 755 565 939 536"
          fill="none" stroke="#957e5d" strokeWidth="46" opacity="0.30"/>
    <path d="M250 895 C420 831 527 751 613 668 C682 602 755 565 939 536"
          fill="none" stroke="#765f48" strokeWidth="2" strokeDasharray="13 12" opacity="0.52"/>
  </g>

  

  

  

  

  

  

  

  

  

  

  

  

  

  <g id="frame">
    <rect x="28" y="28" width="1864" height="1024"
          fill="none" stroke="#512923" strokeWidth="6"/>
    <rect x="42" y="42" width="1836" height="996"
          fill="none" stroke="#725043" strokeWidth="2"/>

    <line x1="42" y1="98" x2="1878" y2="98"
          stroke="#725043" strokeWidth="2"/>

    <path d="M28 62 H56 M42 28 V76
             M1864 28 V76 M1892 62 H1864
             M28 1018 H56 M42 1052 V1004
             M1864 1052 V1004 M1892 1018 H1864"
          fill="none" stroke="#512923" strokeWidth="4"/>
  </g>

  <g id="title-cartouche">
    <rect x="58" y="39" width="626" height="46"
          fill="#d9c092" opacity="0.92"/>
    <text x="70" y="70"
          fill="#4d2924"
          fontFamily="Georgia, serif"
          fontSize="22"
          fontWeight="700"
          letterSpacing="5">KOSTI — 21 JUIN 2026</text>

    <text x="1848" y="70"
          fill="#4d2924"
          fontFamily="Georgia, serif"
          fontSize="17"
          fontStyle="italic"
          fontWeight="700"
          letterSpacing="2"
          textAnchor="end">CARTE DE SITUATION</text>
  </g>

        <g><g opacity={Math.min(1,Math.max(0,(f-4)/16))}><rect x='915' y='420' width='340' height='222' fill='none' stroke='#2b2117' strokeWidth='1' strokeDasharray='7 6' opacity='0.5'/><rect x='950' y='448' width='160' height='64' fill='#e7bd78' fillOpacity='0.35' stroke='#2b2117' strokeWidth='1.4'/><rect x='954' y='452' width='152' height='56' fill='none' stroke='#2b2117' strokeWidth='0.7'/><rect x='950' y='448' width='4' height='4' fill='#2b2117'/><rect x='1106' y='448' width='4' height='4' fill='#2b2117'/><rect x='950' y='508' width='4' height='4' fill='#2b2117'/><rect x='1106' y='508' width='4' height='4' fill='#2b2117'/><rect x='972' y='475' width='16' height='10' fill='#f2ebd9' stroke='#2b2117' strokeWidth='1.2'/><line x1='980' y1='475' x2='980' y2='485' stroke='#2b2117' strokeWidth='0.6'/><rect x='1022' y='475' width='16' height='10' fill='#f2ebd9' stroke='#2b2117' strokeWidth='1.2'/><line x1='1030' y1='475' x2='1030' y2='485' stroke='#2b2117' strokeWidth='0.6'/><rect x='1072' y='475' width='16' height='10' fill='#f2ebd9' stroke='#2b2117' strokeWidth='1.2'/><line x1='1080' y1='475' x2='1080' y2='485' stroke='#2b2117' strokeWidth='0.6'/><rect x='1130' y='440' width='92' height='62' fill='#c7a977' stroke='#2b2117' strokeWidth='1.4'/><rect x='1133' y='443' width='86' height='56' fill='none' stroke='#2b2117' strokeWidth='0.5'/><path d='M1130 502 L1192 440 M1130 488 L1176 440' stroke='#2b2117' strokeWidth='0.6' opacity='0.6'/><rect x='1150' y='486' width='12' height='16' fill='none' stroke='#2b2117' strokeWidth='0.8'/><circle cx='940' cy='600' r='20' fill='#e7bd78' fillOpacity='0.5' stroke='#2b2117' strokeWidth='1.4'/><circle cx='940' cy='600' r='12' fill='none' stroke='#2b2117' strokeWidth='0.7'/><path d='M953 585 L985 515' stroke='#2b2117' strokeWidth='0.9' strokeDasharray='4 4' fill='none'/><ellipse cx='1046' cy='610' rx='40' ry='13' fill='#c7a977' stroke='#2b2117' strokeWidth='1.3'/><rect x='1086' y='599' width='24' height='22' fill='#e7bd78' stroke='#2b2117' strokeWidth='1.2'/><ellipse cx='1046' cy='610' rx='40' ry='13' fill='#4a1f18' opacity={0.45*Math.min(1,Math.max(0,(f-166)/14))}/><rect x='1086' y='599' width='24' height='22' fill='#4a1f18' opacity={0.45*Math.min(1,Math.max(0,(f-166)/14))}/></g><g opacity={Math.min(1,Math.max(0,(f-18)/10))}><rect x='1148' y='352' width='210' height='34' fill='#f2ebd9' stroke='#2b2117' strokeWidth='1.2'/><rect x='1151' y='355' width='204' height='28' fill='none' stroke='#2b2117' strokeWidth='0.5'/><text x='1253' y='374' textAnchor='middle' fontFamily='Georgia, serif' fontSize='13.5' letterSpacing='3' fill='#2b2117'>STATION-SERVICE</text><line x1='1158' y1='386' x2='1114' y2='444' stroke='#2b2117' strokeWidth='1'/></g><text x='940' y='648' textAnchor='middle' fontFamily='Georgia, serif' fontSize='10' letterSpacing='2' fill='#2b2117' opacity={0.85*Math.min(1,Math.max(0,(f-26)/8))}>CUVE</text><g opacity={Math.min(1,Math.max(0,(f-34)/10))} transform='translate(865 598) rotate(-30)'><rect x='-16' y='-7.5' width='32' height='15' fill='#c7a977' stroke='#2b2117' strokeWidth='1.3'/><rect x='-5' y='-5' width='12' height='10' fill='#e7bd78' fillOpacity='0.55' stroke='#2b2117' strokeWidth='0.7'/><line x1='8' y1='-7.5' x2='8' y2='7.5' stroke='#2b2117' strokeWidth='0.7'/><rect x='-16' y='-7.5' width='32' height='15' fill='#4a1f18' opacity={0.55*Math.min(1,Math.max(0,(f-160)/14))}/></g><g opacity={Math.min(1,Math.max(0,(f-40)/10))} transform='translate(795 624) rotate(-38)'><rect x='-16' y='-7.5' width='32' height='15' fill='#c7a977' stroke='#2b2117' strokeWidth='1.3'/><rect x='-5' y='-5' width='12' height='10' fill='#e7bd78' fillOpacity='0.55' stroke='#2b2117' strokeWidth='0.7'/><line x1='8' y1='-7.5' x2='8' y2='7.5' stroke='#2b2117' strokeWidth='0.7'/><rect x='-16' y='-7.5' width='32' height='15' fill='#4a1f18' opacity={0.55*Math.min(1,Math.max(0,(f-162)/14))}/></g><g stroke='#2b2117' strokeWidth='1.3' fill='#f2ebd9'><circle cx='991' cy='494' r='5' opacity={Math.min(1,Math.max(0,(f-30)/8))*(1-Math.min(1,Math.max(0,(f-150)/6)))}/><circle cx='1031' cy='493' r='5' opacity={Math.min(1,Math.max(0,(f-34)/8))*(1-Math.min(1,Math.max(0,(f-150)/6)))}/><circle cx='1067' cy='496' r='5' opacity={Math.min(1,Math.max(0,(f-38)/8))*(1-Math.min(1,Math.max(0,(f-150)/6)))}/><circle cx='955' cy='522' r='5' opacity={Math.min(1,Math.max(0,(f-45)/8))*(1-Math.min(1,Math.max(0,(f-150)/6)))}/><circle cx='905' cy='543' r='5' opacity={Math.min(1,Math.max(0,(f-51)/8))*(1-Math.min(1,Math.max(0,(f-150)/6)))}/><circle cx='855' cy='566' r='5' opacity={Math.min(1,Math.max(0,(f-57)/8))*(1-Math.min(1,Math.max(0,(f-150)/6)))}/><circle cx='930' cy='532' r='5' opacity={Math.min(1,Math.max(0,(f-48)/8))*(1-Math.min(1,Math.max(0,(f-174)/28)))}/><circle cx='880' cy='554' r='5' opacity={Math.min(1,Math.max(0,(f-54)/8))*(1-Math.min(1,Math.max(0,(f-174)/28)))}/><circle cx='830' cy='578' r='5' opacity={Math.min(1,Math.max(0,(f-60)/8))*(1-Math.min(1,Math.max(0,(f-174)/28)))}/><circle cx='805' cy='591' r='5' opacity={Math.min(1,Math.max(0,(f-63)/8))*(1-Math.min(1,Math.max(0,(f-174)/28)))}/><circle cx='780' cy='604' r='5' opacity={Math.min(1,Math.max(0,(f-66)/8))*(1-Math.min(1,Math.max(0,(f-174)/28)))}/><circle cx='755' cy='617' r='5' opacity={Math.min(1,Math.max(0,(f-69)/8))*(1-Math.min(1,Math.max(0,(f-174)/28)))}/><circle cx='730' cy='631' r='5' opacity={Math.min(1,Math.max(0,(f-72)/8))*(1-Math.min(1,Math.max(0,(f-174)/28)))}/><circle cx='705' cy='645' r='5' opacity={Math.min(1,Math.max(0,(f-75)/8))*(1-Math.min(1,Math.max(0,(f-174)/28)))}/><circle cx='680' cy='659' r='5' opacity={Math.min(1,Math.max(0,(f-78)/8))*(1-Math.min(1,Math.max(0,(f-174)/28)))}/></g><g fill='none' stroke='#2b2117' strokeWidth='1.1'><rect x='939' y='540' width='6' height='8' opacity={Math.min(1,Math.max(0,(f-48)/8))}/><rect x='864' y='574' width='6' height='8' opacity={Math.min(1,Math.max(0,(f-57)/8))}/><rect x='789' y='612' width='6' height='8' opacity={Math.min(1,Math.max(0,(f-66)/8))}/><rect x='714' y='653' width='6' height='8' opacity={Math.min(1,Math.max(0,(f-75)/8))}/></g><g opacity={Math.min(1,Math.max(0,(f-62)/10))}><rect x='430' y='486' width='260' height='46' fill='#f2ebd9' stroke='#2b2117' strokeWidth='1.2'/><rect x='433' y='489' width='254' height='40' fill='none' stroke='#2b2117' strokeWidth='0.5'/><text x='560' y='508' textAnchor='middle' fontFamily='Georgia, serif' fontSize='15' letterSpacing='4' fill='#2b2117'>CIVILS</text><text x='560' y='525' textAnchor='middle' fontFamily='Georgia, serif' fontSize='11.5' fontStyle='italic' fill='#2b2117'>file d'attente — essence</text><line x1='690' y1='512' x2='826' y2='572' stroke='#2b2117' strokeWidth='1'/></g><g opacity={Math.min(1,Math.max(0,(f-86)/8))}><circle cx='1720' cy='150' r='7' fill='none' stroke='#8a2a20' strokeWidth='1.5'/><circle cx='1720' cy='150' r='2.2' fill='#8a2a20'/><g transform={'rotate('+(f*1.5)+' 1720 150)'}><circle cx='1720' cy='150' r='13' fill='none' stroke='#8a2a20' strokeWidth='1' strokeDasharray='3 4'/></g></g><g opacity={Math.min(1,Math.max(0,(f-92)/8))}><rect x='1425' y='104' width='330' height='28' fill='#f2ebd9' stroke='#2b2117' strokeWidth='1.1'/><text x='1590' y='123' textAnchor='middle' fontFamily='Georgia, serif' fontSize='11' letterSpacing='2' fill='#2b2117'>VECTEUR RSF — DEPUIS LE NORD-EST</text><line x1='1630' y1='132' x2='1708' y2='148' stroke='#2b2117' strokeWidth='0.9'/></g><g opacity={Math.min(1,Math.max(0,(f-96)/8))}><rect x='1145' y='298' width='160' height='30' fill='#f2ebd9' stroke='#2b2117' strokeWidth='1.1'/><text x='1225' y='318' textAnchor='middle' fontFamily='Georgia, serif' fontSize='13' letterSpacing='3' fontWeight='700' fill='#8a2a20'>DRONE RSF</text><line x1='1305' y1='313' x2='1350' y2='316' stroke='#8a2a20' strokeWidth='0.9'/></g><path d='M1720 150 L1010 483' fill='none' stroke='#8a2a20' strokeWidth='2' pathLength='100' strokeDasharray='100' strokeDashoffset={100-100*Math.min(1,Math.max(0,(f-80)/70))} opacity={1-Math.min(1,Math.max(0,(f-150)/8))}/><path d='M1720 150 L1010 483' fill='none' stroke='#8a2a20' strokeWidth='1.6' strokeDasharray='9 7' opacity={Math.min(1,Math.max(0,(f-150)/8))*0.85*(1-0.35*Math.min(1,Math.max(0,(f-215)/40)))}/><text x='1490' y='240' transform='rotate(-25 1490 240)' fontFamily='Georgia, serif' fontSize='10' letterSpacing='2' fill='#8a2a20' opacity={Math.min(1,Math.max(0,(f-138)/8))}>4,2 KM</text><g opacity={Math.min(1,Math.max(0,(f-80)/5))*(f<150?1:Math.max(0,1-(f-150)/4))} transform={'translate('+(1720-710*Math.min(1,Math.max(0,(f-80)/70)))+' '+(150+333*Math.min(1,Math.max(0,(f-80)/70)))+')'}><g transform='rotate(155)'><polygon points='14,0 5,5 5,-5' fill='#4a1f18'/><line x1='-14' y1='-14' x2='14' y2='14' stroke='#4a1f18' strokeWidth='2.4'/><line x1='-14' y1='14' x2='14' y2='-14' stroke='#4a1f18' strokeWidth='2.4'/><circle r='6' fill='#8a2a20'/><g transform={'rotate('+(f*16)+' 14 14)'}><circle cx='14' cy='14' r='7' fill='none' stroke='#8a2a20' strokeWidth='1.4'/><line x1='8' y1='14' x2='20' y2='14' stroke='#8a2a20' strokeWidth='1.2'/></g><g transform={'rotate('+(-f*16)+' -14 14)'}><circle cx='-14' cy='14' r='7' fill='none' stroke='#8a2a20' strokeWidth='1.4'/><line x1='-20' y1='14' x2='-8' y2='14' stroke='#8a2a20' strokeWidth='1.2'/></g><g transform={'rotate('+(-f*16)+' 14 -14)'}><circle cx='14' cy='-14' r='7' fill='none' stroke='#8a2a20' strokeWidth='1.4'/><line x1='8' y1='-14' x2='20' y2='-14' stroke='#8a2a20' strokeWidth='1.2'/></g><g transform={'rotate('+(f*16)+' -14 -14)'}><circle cx='-14' cy='-14' r='7' fill='none' stroke='#8a2a20' strokeWidth='1.4'/><line x1='-20' y1='-14' x2='-8' y2='-14' stroke='#8a2a20' strokeWidth='1.2'/></g></g></g><g opacity={Math.min(1,Math.max(0,(f-118)/10))*(1-Math.min(1,Math.max(0,(f-148)/8)))}><g transform={'rotate('+(f*2)+' 1010 483)'}><circle cx='1010' cy='483' r='44' fill='none' stroke='#8a2a20' strokeWidth='1.5' strokeDasharray='12 9'/></g><line x1='1010' y1='431' x2='1010' y2='445' stroke='#8a2a20' strokeWidth='1.5'/><line x1='1010' y1='521' x2='1010' y2='535' stroke='#8a2a20' strokeWidth='1.5'/><line x1='958' y1='483' x2='972' y2='483' stroke='#8a2a20' strokeWidth='1.5'/><line x1='1048' y1='483' x2='1062' y2='483' stroke='#8a2a20' strokeWidth='1.5'/><circle cx='1010' cy='483' r='2' fill='#8a2a20'/><text x='1078' y='440' fontFamily='Georgia, serif' fontSize='10' letterSpacing='2' fill='#8a2a20' opacity='0.9'>06:47:12</text></g><g opacity={Math.max(0,Math.min(1,(f-150)/2))}><circle cx='1010' cy='483' r={10+Math.max(0,(f-150))*6} fill='#f2ebd9' opacity={Math.max(0,0.9-Math.max(0,(f-150))/12)}/><circle cx='1010' cy='483' r={5+Math.max(0,(f-150))*3.2} fill='#e7bd78' opacity={Math.max(0,0.95-Math.max(0,(f-150))/9)}/><circle cx='1010' cy='483' r={Math.max(0,(f-151)*3.2)} fill='none' stroke='#f2ebd9' strokeWidth='4' opacity={Math.max(0,0.9-Math.max(0,(f-151))/40)}/><circle cx='1010' cy='483' r={Math.max(0,(f-156)*3.2)} fill='none' stroke='#8a2a20' strokeWidth='2.5' opacity={Math.max(0,0.85-Math.max(0,(f-156))/42)}/><circle cx='1010' cy='483' r={Math.max(0,(f-163)*3.2)} fill='none' stroke='#4a1f18' strokeWidth='1.5' opacity={Math.max(0,0.8-Math.max(0,(f-163))/42)}/><g stroke='#4a1f18' strokeWidth='1.5' opacity={Math.max(0,1-Math.max(0,(f-152))/20)}><line x1='1022' y1='486' x2='1054' y2='495'/><line x1='1016' y1='493' x2='1033' y2='523'/><line x1='1007' y1='495' x2='1000' y2='522'/><line x1='1000' y1='489' x2='968' y2='507'/><line x1='998' y1='480' x2='969' y2='472'/><line x1='1004' y1='473' x2='985' y2='440'/><line x1='1013' y1='471' x2='1021' y2='441'/><line x1='1020' y1='477' x2='1043' y2='464'/></g><circle cx='940' cy='600' r={Math.min(46,5+Math.max(0,(f-170))*4)} fill='#f2ebd9' opacity={Math.max(0,0.8-Math.max(0,(f-170))/9)}/><circle cx='940' cy='600' r={Math.max(0,(f-172)*2.4)} fill='none' stroke='#8a2a20' strokeWidth='2' opacity={Math.max(0,0.8-Math.max(0,(f-172))/40)}/></g><ellipse cx='1010' cy='483' rx='135' ry='92' fill='#4a1f18' opacity={0.16*Math.min(1,Math.max(0,(f-152)/16))}/><polygon points='1038,483 1033,499 1020,508 1004,506 992,497 985,483 990,468 1002,459 1018,460 1031,469' fill='#4a1f18' opacity={0.9*Math.min(1,Math.max(0,(f-155)/8))}/><polygon points='950,448 1012,448 994,512 950,512' fill='#4a1f18' opacity={0.3*Math.min(1,Math.max(0,(f-154)/10))}/><rect x='972' y='475' width='16' height='10' fill='#4a1f18' opacity={0.6*Math.min(1,Math.max(0,(f-154)/10))}/><rect x='1022' y='475' width='16' height='10' fill='#4a1f18' opacity={0.6*Math.min(1,Math.max(0,(f-154)/10))}/><g><ellipse cx='1004' cy='476' rx='9' ry='7' fill='#8a2a20' opacity={Math.min(1,Math.max(0,(f-162)/10))*(0.5+0.28*Math.sin(f*0.32))}/><ellipse cx='1004' cy='476' rx='4.5' ry='3.5' fill='#e7bd78' opacity={Math.min(1,Math.max(0,(f-162)/10))*(0.6+0.3*Math.sin(f*0.32+1))}/><ellipse cx='1032' cy='498' rx='7' ry='5.5' fill='#8a2a20' opacity={Math.min(1,Math.max(0,(f-168)/10))*(0.5+0.28*Math.sin(f*0.32+2))}/><ellipse cx='1032' cy='498' rx='3.5' ry='2.8' fill='#e7bd78' opacity={Math.min(1,Math.max(0,(f-168)/10))*(0.6+0.3*Math.sin(f*0.32+3))}/><ellipse cx='938' cy='594' rx='11' ry='8' fill='#8a2a20' opacity={Math.min(1,Math.max(0,(f-176)/10))*(0.5+0.28*Math.sin(f*0.32+4))}/><ellipse cx='938' cy='594' rx='5.5' ry='4' fill='#e7bd78' opacity={Math.min(1,Math.max(0,(f-176)/10))*(0.6+0.3*Math.sin(f*0.32+5))}/><ellipse cx='1052' cy='608' rx='6' ry='4.5' fill='#8a2a20' opacity={Math.min(1,Math.max(0,(f-172)/10))*(0.5+0.28*Math.sin(f*0.32+1))}/></g><g fill='#4a1f18'><ellipse cx={1010-Math.min(55,Math.max(0,(f-165))*0.22)} cy={468-Math.min(80,Math.max(0,(f-165))*0.42)} rx={Math.min(115,30+Math.max(0,(f-165))*0.4)} ry={Math.min(115,30+Math.max(0,(f-165))*0.4)*0.62} opacity={0.2*Math.min(1,Math.max(0,(f-165)/30))*(0.85+0.15*Math.sin(f*0.045))}/><ellipse cx={1042-Math.min(40,Math.max(0,(f-178))*0.2)} cy={502-Math.min(60,Math.max(0,(f-178))*0.38)} rx={Math.min(70,20+Math.max(0,(f-178))*0.3)} ry={Math.min(70,20+Math.max(0,(f-178))*0.3)*0.62} opacity={0.14*Math.min(1,Math.max(0,(f-178)/30))*(0.85+0.15*Math.sin(f*0.04+2))}/><ellipse cx={940-Math.min(30,Math.max(0,(f-174))*0.15)} cy={598-Math.min(70,Math.max(0,(f-174))*0.36)} rx={Math.min(85,24+Math.max(0,(f-174))*0.34)} ry={Math.min(85,24+Math.max(0,(f-174))*0.34)*0.62} opacity={0.17*Math.min(1,Math.max(0,(f-174)/30))*(0.85+0.15*Math.sin(f*0.05+4))}/></g><g><g transform='translate(991 494) rotate(20)' opacity={Math.min(1,Math.max(0,(f-152)/6))}><path d='M-5 -5 L5 5 M-5 5 L5 -5' stroke='#4a1f18' strokeWidth='2.2'/><circle r='7.5' fill='none' stroke='#8a2a20' strokeWidth='1' opacity='0.8'/></g><g transform='translate(1031 493) rotate(-35)' opacity={Math.min(1,Math.max(0,(f-155)/6))}><path d='M-5 -5 L5 5 M-5 5 L5 -5' stroke='#4a1f18' strokeWidth='2.2'/><circle r='7.5' fill='none' stroke='#8a2a20' strokeWidth='1' opacity='0.8'/></g><g transform='translate(1067 496) rotate(60)' opacity={Math.min(1,Math.max(0,(f-158)/6))}><path d='M-5 -5 L5 5 M-5 5 L5 -5' stroke='#4a1f18' strokeWidth='2.2'/><circle r='7.5' fill='none' stroke='#8a2a20' strokeWidth='1' opacity='0.8'/></g><g transform='translate(955 522) rotate(-15)' opacity={Math.min(1,Math.max(0,(f-161)/6))}><path d='M-5 -5 L5 5 M-5 5 L5 -5' stroke='#4a1f18' strokeWidth='2.2'/><circle r='7.5' fill='none' stroke='#8a2a20' strokeWidth='1' opacity='0.8'/></g><g transform='translate(905 543) rotate(40)' opacity={Math.min(1,Math.max(0,(f-164)/6))}><path d='M-5 -5 L5 5 M-5 5 L5 -5' stroke='#4a1f18' strokeWidth='2.2'/><circle r='7.5' fill='none' stroke='#8a2a20' strokeWidth='1' opacity='0.8'/></g><g transform='translate(855 566) rotate(-70)' opacity={Math.min(1,Math.max(0,(f-167)/6))}><path d='M-5 -5 L5 5 M-5 5 L5 -5' stroke='#4a1f18' strokeWidth='2.2'/><circle r='7.5' fill='none' stroke='#8a2a20' strokeWidth='1' opacity='0.8'/></g></g><g opacity={0.7*(1-Math.min(1,Math.max(0,(f-202)/14)))}><path d='M836 590 L776 654' fill='none' stroke='#2b2117' strokeWidth='1.2' strokeDasharray='5 4' pathLength='100' strokeDashoffset={100*(1-Math.min(1,Math.max(0,(f-176)/16)))}/><polygon points='776,654 785.4,649.1 780.3,644.3' fill='#2b2117' opacity={Math.min(1,Math.max(0,(f-190)/4))}/><path d='M760 626 L702 692' fill='none' stroke='#2b2117' strokeWidth='1.2' strokeDasharray='5 4' pathLength='100' strokeDashoffset={100*(1-Math.min(1,Math.max(0,(f-180)/16)))}/><polygon points='702,692 711.2,686.8 706,682.2' fill='#2b2117' opacity={Math.min(1,Math.max(0,(f-194)/4))}/></g><g opacity={Math.min(1,Math.max(0,(f-210)/12))}><rect x='150' y='180' width='480' height='176' fill='#f2ebd9' fillOpacity='0.95' stroke='#2b2117' strokeWidth='1.5'/><rect x='154' y='184' width='472' height='168' fill='none' stroke='#2b2117' strokeWidth='0.5'/><rect x='150' y='180' width='7' height='176' fill='#8a2a20'/><text x='178' y='212' fontFamily='Georgia, serif' fontSize='12' letterSpacing='2' fill='#2b2117' opacity={Math.min(1,Math.max(0,(f-215)/8))}>21 JUIN 2026 — 06:47</text><text x='178' y='241' fontFamily='Georgia, serif' fontSize='19' letterSpacing='3' fontWeight='700' fill='#8a2a20' opacity={Math.min(1,Math.max(0,(f-221)/8))}>FRAPPE DE DRONE — RSF</text><text x='178' y='267' fontFamily='Georgia, serif' fontSize='12.5' letterSpacing='1.5' fill='#2b2117' opacity={Math.min(1,Math.max(0,(f-230)/8))}>STATION-SERVICE · FILE D'ATTENTE D'ESSENCE</text><text x='178' y='289' fontFamily='Georgia, serif' fontSize='12.5' letterSpacing='2' fontWeight='700' fill='#4a1f18' opacity={Math.min(1,Math.max(0,(f-238)/8))}>AUCUNE CIBLE MILITAIRE</text><line x1='178' y1='302' x2='340' y2='302' stroke='#c7a977' strokeWidth='1' opacity={Math.min(1,Math.max(0,(f-244)/8))}/><text x='178' y='336' fontFamily='Georgia, serif' fontSize='23' letterSpacing='4' fontWeight='700' fill='#8a2a20' opacity={Math.min(1,Math.max(0,(f-252)/8))}>LE PRIX : DES CIVILS.</text></g><g opacity={Math.min(1,Math.max(0,(f-232)/10))}><rect x='1330' y='185' width='345' height='32' fill='#f2ebd9' stroke='#2b2117' strokeWidth='1.2'/><rect x='1333' y='188' width='339' height='26' fill='none' stroke='#2b2117' strokeWidth='0.5'/><text x='1502' y='206' textAnchor='middle' fontFamily='Georgia, serif' fontSize='13' letterSpacing='2.5' fontWeight='700' fill='#8a2a20'>ARMES VENUES DE L'ÉTRANGER</text><path d='M1440 217 L1402 296' fill='none' stroke='#8a2a20' strokeWidth='1.2' strokeDasharray='4 4' pathLength='100' strokeDashoffset={100*(1-Math.min(1,Math.max(0,(f-240)/16)))}/></g><g opacity={Math.min(1,Math.max(0,(f-268)/22))}><line x1='1520' y1='926' x2='1600' y2='926' stroke='#8a2a20' strokeWidth='1'/><text x='1560' y='958' textAnchor='middle' fontFamily='Georgia, serif' fontSize='16' fontStyle='italic' letterSpacing='1.5' fill='#4a1f18'>Des gens ordinaires. Une frappe. Puis le vide.</text></g></g>
      </svg>
    </AbsoluteFill>
  );
};
