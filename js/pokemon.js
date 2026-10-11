// 지역 한정 포켓몬 데이터
// 출처: PokeXperience "Regionals" (https://pokexperience.com/regionals/, 2026-08-24 검증본) 기준.
//       싸리용은 해당 페이지에 없어 Serebii (https://serebii.net/pokemongo/exclusives.shtml) 기준.
// 필드:
//   id     체크리스트 저장 키 (고유)
//   dex    전국도감 번호 (검색어 생성에 사용)
//   ko/en  이름,  form/formEn  폼 이름(있을 때)
//   zone   벤다이어그램 위치
//            AM 아메리카 · EM 유럽·중동·아프리카 · AP 아시아·태평양
//            AM_EM 아메리카+아프리카 · EM_AP 유럽·아시아·오세아니아
//            WEST/EAST 서·동반구(경도 0°) · FAR_NORTH/NORTH/SOUTH/TROPICS 위도대
//            F_AM/F_EM/F_AP/F_WEST/F_EAST/F_ISLAND 어디서나 나오지만 지역마다 폼이 다름(폼 다이어그램)
//            BIOME 지형 기준(국가로 정해지지 않음) · UNOWN 안농(안농 페이지)
//            PT_WEST/PT_IBERIA/PT_EAST 팔데아 켄타로스 (레이드 페이지)
//   scope  권역 전체가 아니라 일부 지역에서만 나올 때 그 지역 이름
//   area   위치 판정용 지역 (js/areas.js 의 id 또는 { any, not, all } 식). null 이면 판정 불가
//   region 사람이 읽는 지역 설명
//   approx true 면 경계가 특히 부정확하거나 출처마다 다름
//   raid   true 면 레이드로 잡는 포켓몬 (레이드 페이지에 표시)
//   evo    true 면 진화형(기본적으로 숨김)
//   sprite PokeAPI 스프라이트 파일 이름 (없으면 dex)
//   note   비고

const POKEMON = [
  // ── 아메리카 ─────────────────────────────────
  { id: '482', dex: 482, ko: '아그놈', en: 'Azelf', raid: true, zone: 'AM', area: 'americas', region: '아메리카·그린란드' },
  { id: '515', dex: 515, ko: '앗차프', en: 'Panpour', zone: 'AM', area: 'americas', region: '아메리카' },
  { id: '516', dex: 516, ko: '앗차키', en: 'Simipour', zone: 'AM', area: 'americas', region: '아메리카', evo: true },
  { id: '669-yellow', dex: 669, ko: '플라베베', en: 'Flabébé', form: '노란꽃', formEn: 'Yellow Flower', zone: 'F_AM', area: 'americas', region: '아메리카' },
  { id: '670-yellow', dex: 670, ko: '플라엣테', en: 'Floette', form: '노란꽃', formEn: 'Yellow Flower', zone: 'F_AM', area: 'americas', region: '아메리카', evo: true },
  { id: '671-yellow', dex: 671, ko: '플라제스', en: 'Florges', form: '노란꽃', formEn: 'Yellow Flower', zone: 'F_AM', area: 'americas', region: '아메리카', evo: true },
  { id: '978-droopy', dex: 978, ko: '싸리용', en: 'Tatsugiri', form: '늘어진모습', formEn: 'Droopy Form', zone: 'F_AM', area: 'americas', region: '아메리카' },
  { id: '676-debutante', dex: 676, ko: '트리미앙', en: 'Furfrou', form: '레이디컷', formEn: 'Debutante Trim', zone: 'F_AM', area: 'americas', region: '아메리카', note: '컷 변경으로 획득' },
  { id: '741-pompom', dex: 741, ko: '춤추새', en: 'Oricorio', form: '파칙파칙스타일', formEn: 'Pom-Pom Style', zone: 'F_AM', area: { any: ['americas'], not: ['pau_islands'] }, region: '아메리카 (섬 지역 제외)', approx: true },
  { id: '128', dex: 128, ko: '켄타로스', en: 'Tauros', zone: 'AM', scope: '미국·캐나다 남부', area: { any: ['usa_canada'], not: ['canada_north'] }, region: '미국·캐나다 남부' },
  { id: '214', dex: 214, ko: '헤라크로스', en: 'Heracross', zone: 'AM', scope: '중남미', area: { any: ['central_america', 'south_america'] }, region: '중앙·남아메리카' },
  { id: '556', dex: 556, ko: '마라카치', en: 'Maractus', zone: 'AM', scope: '멕시코~남미', area: { any: ['mexico', 'central_america', 'south_america'] }, region: '멕시코·중앙아메리카·남아메리카' },
  { id: '455', dex: 455, ko: '무스틈니', en: 'Carnivine', zone: 'AM', scope: '미국 남동부', area: 'se_usa', region: '미국 남동부', approx: true },
  { id: '701', dex: 701, ko: '루차불', en: 'Hawlucha', zone: 'AM', scope: '멕시코', area: 'mexico', region: '멕시코' },
  { id: '626', dex: 626, ko: '버프론', en: 'Bouffalant', zone: 'AM', scope: '뉴욕·미국 북동부', area: 'us_northeast', region: '뉴욕 및 인근 미국 북동부 주', approx: true },
  { id: '764', dex: 764, ko: '큐아링', en: 'Comfey', zone: 'AM', scope: '하와이', area: 'hawaii', region: '하와이' },

  // ── 유럽·중동·아프리카 ─────────────────────────
  { id: '481', dex: 481, ko: '엠라이트', en: 'Mesprit', raid: true, zone: 'EM', area: 'emea_india', region: '유럽·중동·아프리카·인도' },
  { id: '513', dex: 513, ko: '바오프', en: 'Pansear', zone: 'EM', area: 'emea_india', region: '유럽·중동·아프리카·인도' },
  { id: '514', dex: 514, ko: '바오키', en: 'Simisear', zone: 'EM', area: 'emea_india', region: '유럽·중동·아프리카·인도', evo: true },
  { id: '669-red', dex: 669, ko: '플라베베', en: 'Flabébé', form: '빨간꽃', formEn: 'Red Flower', zone: 'F_EM', area: 'emea', region: '유럽·중동·아프리카' },
  { id: '670-red', dex: 670, ko: '플라엣테', en: 'Floette', form: '빨간꽃', formEn: 'Red Flower', zone: 'F_EM', area: 'emea', region: '유럽·중동·아프리카', evo: true },
  { id: '671-red', dex: 671, ko: '플라제스', en: 'Florges', form: '빨간꽃', formEn: 'Red Flower', zone: 'F_EM', area: 'emea', region: '유럽·중동·아프리카', evo: true },
  { id: '978-curly', dex: 978, ko: '싸리용', en: 'Tatsugiri', form: '젖힌모습', formEn: 'Curly Form', zone: 'F_EM', area: 'emea', region: '유럽·중동·아프리카' },
  { id: '676-diamond', dex: 676, ko: '트리미앙', en: 'Furfrou', form: '다이아컷', formEn: 'Diamond Trim', zone: 'F_EM', area: { any: ['emea'], not: ['france', 'egypt'] }, region: '유럽·중동·아프리카 (프랑스·이집트 제외)', note: '컷 변경으로 획득' },
  { id: '741-baile', dex: 741, ko: '춤추새', en: 'Oricorio', form: '이글이글스타일', formEn: 'Baile Style', zone: 'F_EM', area: { any: ['emea'], not: ['pau_islands'] }, region: '유럽·중동·아프리카 (섬 지역 제외)', approx: true },
  { id: '122', dex: 122, ko: '마임맨', en: 'Mr. Mime', zone: 'EM', scope: '유럽', area: 'europe', region: '유럽' },
  { id: '439', dex: 439, ko: '흉내내', en: 'Mime Jr.', zone: 'EM', scope: '유럽', area: 'europe', region: '유럽', note: '알에서 부화' },
  { id: '357', dex: 357, ko: '트로피우스', en: 'Tropius', zone: 'EM', scope: '아프리카·중동', area: { any: ['africa', 'middle_east'] }, region: '아프리카·중동' },
  { id: '561', dex: 561, ko: '심보러', en: 'Sigilyph', zone: 'EM', scope: '이집트·그리스', area: { any: ['egypt', 'greece'] }, region: '이집트·그리스' },
  { id: '128-combat', dex: 128, ko: '켄타로스', en: 'Tauros', raid: true, form: '팔데아 컴뱃종', formEn: 'Paldean Combat Breed', zone: 'PT_IBERIA', area: 'iberia', region: '이베리아 반도' },
  { id: '707', dex: 707, ko: '클레피', en: 'Klefki', zone: 'EM', scope: '프랑스 일대', area: 'klefki_zone', region: '프랑스·룩셈부르크·스위스 서부·영국 남동부 해안', approx: true },
  { id: '676-lareine', dex: 676, ko: '트리미앙', en: 'Furfrou', form: '퀸컷', formEn: 'La Reine Trim', zone: 'F_EM', scope: '프랑스', area: 'france', region: '프랑스', note: '컷 변경으로 획득' },
  { id: '676-pharaoh', dex: 676, ko: '트리미앙', en: 'Furfrou', form: '킹덤컷', formEn: 'Pharaoh Trim', zone: 'F_EM', scope: '이집트', area: 'egypt', region: '이집트', note: '컷 변경으로 획득' },
  { id: '874', dex: 874, ko: '돌헨진', en: 'Stonjourner', zone: 'EM', scope: '영국', area: 'uk', region: '영국' },

  // ── 아시아·태평양 ─────────────────────────────
  { id: '480', dex: 480, ko: '유크시', en: 'Uxie', raid: true, zone: 'AP', area: 'apac_no_india', region: '아시아·태평양 (인도 제외)' },
  { id: '511', dex: 511, ko: '야나프', en: 'Pansage', zone: 'AP', area: 'apac_no_india', region: '아시아·태평양 (인도 제외)' },
  { id: '512', dex: 512, ko: '야나키', en: 'Simisage', zone: 'AP', area: 'apac_no_india', region: '아시아·태평양 (인도 제외)', evo: true },
  { id: '669-blue', dex: 669, ko: '플라베베', en: 'Flabébé', form: '파란꽃', formEn: 'Blue Flower', zone: 'F_AP', area: 'apac', region: '아시아·태평양' },
  { id: '670-blue', dex: 670, ko: '플라엣테', en: 'Floette', form: '파란꽃', formEn: 'Blue Flower', zone: 'F_AP', area: 'apac', region: '아시아·태평양', evo: true },
  { id: '671-blue', dex: 671, ko: '플라제스', en: 'Florges', form: '파란꽃', formEn: 'Blue Flower', zone: 'F_AP', area: 'apac', region: '아시아·태평양', evo: true },
  { id: '978-stretchy', dex: 978, ko: '싸리용', en: 'Tatsugiri', form: '뻗은모습', formEn: 'Stretchy Form', zone: 'F_AP', area: 'apac', region: '아시아·태평양' },
  { id: '676-star', dex: 676, ko: '트리미앙', en: 'Furfrou', form: '스타컷', formEn: 'Star Trim', zone: 'F_AP', area: { any: ['apac'], not: ['japan'] }, region: '아시아·태평양 (일본 제외)', note: '컷 변경으로 획득' },
  { id: '741-sensu', dex: 741, ko: '춤추새', en: 'Oricorio', form: '하늘하늘스타일', formEn: 'Sensu Style', zone: 'F_AP', area: { any: ['apac'], not: ['pau_islands'] }, region: '아시아·태평양 (섬 지역 제외)', approx: true },
  { id: '083', dex: 83, ko: '파오리', en: "Farfetch'd", zone: 'AP', scope: '동아시아', area: 'east_asia', region: '동아시아 (일본·한국·대만·홍콩)' },
  { id: '115', dex: 115, ko: '캥카', en: 'Kangaskhan', zone: 'AP', scope: '호주', area: 'australia', region: '호주' },
  { id: '324', dex: 324, ko: '코터스', en: 'Torkoal', zone: 'AP', scope: '인도·동남아', area: 'torkoal_zone', region: '인도·동남아시아', approx: true },
  { id: '676-kabuki', dex: 676, ko: '트리미앙', en: 'Furfrou', form: '가부키컷', formEn: 'Kabuki Trim', zone: 'F_AP', scope: '일본', area: 'japan', region: '일본', note: '컷 변경으로 획득' },
  { id: '369', dex: 369, ko: '시라칸', en: 'Relicanth', zone: 'AP', scope: '뉴질랜드·태평양 섬', area: { any: ['nz', 'pac_w', 'pac_e'] }, region: '뉴질랜드 및 태평양 섬', approx: true },

  // ── 겹치는 권역 ──────────────────────────────
  { id: '314', dex: 314, ko: '네오비트', en: 'Illumise', zone: 'AM_EM', area: 'americas_africa', region: '아메리카·아프리카' },
  { id: '336', dex: 336, ko: '세비퍼', en: 'Seviper', zone: 'AM_EM', area: 'americas_africa', region: '아메리카·아프리카', },
  { id: '538', dex: 538, ko: '던지미', en: 'Throh', zone: 'AM_EM', area: 'americas_africa', region: '아메리카·아프리카' },
  { id: '632', dex: 632, ko: '아이앤트', en: 'Durant', zone: 'AM_EM', area: 'americas_africa', region: '아메리카·아프리카' },
  { id: '313', dex: 313, ko: '볼비트', en: 'Volbeat', zone: 'EM_AP', area: 'eurasia_oceania', region: '유럽·아시아·오세아니아' },
  { id: '335', dex: 335, ko: '쟝고', en: 'Zangoose', zone: 'EM_AP', area: 'eurasia_oceania', region: '유럽·아시아·오세아니아', },
  { id: '631', dex: 631, ko: '앤티골', en: 'Heatmor', zone: 'EM_AP', area: 'eurasia_oceania', region: '유럽·아시아·오세아니아' },
  { id: '539', dex: 539, ko: '타격귀', en: 'Sawk', zone: 'EM_AP', area: 'eurasia_oceania', region: '유럽·아시아·오세아니아' },
  { id: '417', dex: 417, ko: '파치리스', en: 'Pachirisu', zone: 'FAR_NORTH', area: 'pachirisu_zone', region: '극북 지역 (알래스카·캐나다·러시아·스칸디나비아·아이슬란드)', approx: true },
  { id: '741-pau', dex: 741, ko: '춤추새', en: 'Oricorio', form: '훌라훌라스타일', formEn: "Pa'u Style", zone: 'F_ISLAND', area: 'pau_islands', region: '아프리카·아시아·태평양·카리브해의 섬', approx: true },

  // ── 동·서반구 (경도 0° 기준) ──────────────────
  { id: '422-west', dex: 422, ko: '깝질무', en: 'Shellos', form: '서쪽바다의 모습', formEn: 'West Sea', zone: 'F_WEST', area: 'west', region: '서반구 (경도 0° 서쪽)' },
  { id: '423-west', dex: 423, ko: '트리토돈', en: 'Gastrodon', form: '서쪽바다의 모습', formEn: 'West Sea', zone: 'F_WEST', area: 'west', region: '서반구 (경도 0° 서쪽)', evo: true },
  { id: '550-blue', dex: 550, ko: '배쓰나이', en: 'Basculin', form: '청색근의 모습', formEn: 'Blue-Striped', zone: 'F_WEST', area: 'west', region: '서반구' },
  { id: '337', dex: 337, ko: '루나톤', en: 'Lunatone', zone: 'WEST', area: 'west', region: '서반구 (경도 0° 서쪽)' },
  { id: '806', dex: 806, ko: '두파팡', en: 'Blacephalon', raid: true, zone: 'WEST', area: 'west', region: '서반구' },
  { id: '931-blue', dex: 931, ko: '시비꼬', en: 'Squawkabilly', form: '블루페더', formEn: 'Blue Plumage', zone: 'F_WEST', area: 'west', region: '서반구' },
  { id: '128-aqua', dex: 128, ko: '켄타로스', en: 'Tauros', raid: true, form: '팔데아 워터종', formEn: 'Paldean Aqua Breed', zone: 'PT_WEST', area: 'west', region: '서반구 (경도 0° 서쪽)' },
  { id: '422-east', dex: 422, ko: '깝질무', en: 'Shellos', form: '동쪽바다의 모습', formEn: 'East Sea', zone: 'F_EAST', area: 'east', region: '동반구 (경도 0° 동쪽)' },
  { id: '423-east', dex: 423, ko: '트리토돈', en: 'Gastrodon', form: '동쪽바다의 모습', formEn: 'East Sea', zone: 'F_EAST', area: 'east', region: '동반구 (경도 0° 동쪽)', evo: true },
  { id: '550-red', dex: 550, ko: '배쓰나이', en: 'Basculin', form: '적색근의 모습', formEn: 'Red-Striped', zone: 'F_EAST', area: 'east', region: '동반구' },
  { id: '338', dex: 338, ko: '솔록', en: 'Solrock', zone: 'EAST', area: 'east', region: '동반구 (경도 0° 동쪽)' },
  { id: '805', dex: 805, ko: '차곡차곡', en: 'Stakataka', raid: true, zone: 'EAST', area: 'east', region: '동반구' },
  { id: '931-green', dex: 931, ko: '시비꼬', en: 'Squawkabilly', form: '그린페더', formEn: 'Green Plumage', zone: 'F_EAST', area: 'east', region: '동반구' },
  { id: '128-blaze', dex: 128, ko: '켄타로스', en: 'Tauros', raid: true, form: '팔데아 블레이즈종', formEn: 'Paldean Blaze Breed', zone: 'PT_EAST', area: 'east', region: '동반구 (경도 0° 동쪽)' },

  // ── 위도대 ───────────────────────────────────
  { id: '798', dex: 798, ko: '종이신도', en: 'Kartana', raid: true, zone: 'NORTH', area: 'north', region: '북반구' },
  { id: '222', dex: 222, ko: '코산호', en: 'Corsola', zone: 'TROPICS', area: 'tropics', region: '열대 해안 (약 31°N ~ 26°S)', approx: true },
  { id: '441', dex: 441, ko: '페라페', en: 'Chatot', zone: 'SOUTH', area: 'south', region: '남반구' },
  { id: '797', dex: 797, ko: '철화구야', en: 'Celesteela', raid: true, zone: 'SOUTH', area: 'south', region: '남반구' },

  // ── 지형(바이옴) 기준 ─────────────────────────
  { id: '843', dex: 843, ko: '모래뱀', en: 'Silicobra', zone: 'BIOME', scope: '사막', area: null, region: '사막 지형', note: '국가 단위로 정해지지 않음' },
  { id: '948', dex: 948, ko: '들눈해', en: 'Toedscool', zone: 'BIOME', scope: '숲', area: null, region: '숲 지형', note: '국가 단위로 정해지지 않음' },
  { id: '960', dex: 960, ko: '바다그다', en: 'Wiglett', zone: 'BIOME', scope: '해변', area: null, region: '해변 지형', note: '국가 단위로 정해지지 않음' },
];

// 안농: 지역 상관없이 나오는 28가지 글자 폼
const UNOWN_FORMS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '!', '?'];
UNOWN_FORMS.forEach((ch) => {
  const slug = ch === '!' ? 'exclamation' : ch === '?' ? 'question' : ch.toLowerCase();
  POKEMON.push({
    id: '201-' + slug, dex: 201, ko: '안농', en: 'Unown', form: ch, formEn: ch, zone: 'UNOWN', area: null,
    region: '전 지역 (주로 이벤트)', sprite: slug === 'a' ? '201' : '201-' + slug,
  });
});
