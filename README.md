# Weather Outfit Recommender

날씨, 스타일 취향, 상황 정보를 바탕으로 오늘 입기 좋은 옷 조합과 브랜드를 추천하는 데일리 코디 추천 앱입니다.

현재 버전은 Express 기반 API MVP이며, 향후 사용자 스타일 프로필과 옷장 데이터를 활용한 개인화 추천 앱으로 확장하는 것을 목표로 합니다.

## 목표

- 월간 사용자 10,000명 규모까지 확장 가능한 코디 추천 서비스로 발전
- 날씨 변수와 패션 트렌드를 결합한 실용적인 추천 제공
- 사용자 평소 스타일을 학습해 더 정확한 코디 피드백 제공
- 개개인의 스타일에 맞는 매치 아이템과 브랜드 추천 제공

## 핵심 기능

### 1. 날씨 기반 컨텍스트

- 현재 기온
- 체감온도
- 습도
- 풍속
- 날씨 상태와 설명
- 비 여부

### 2. 날씨 기반 코디 추천

- 온도 구간별 기본 아이템 추천
- 비 오는 날 스타일링 팁
- 레이어링 추천
- 색상 팔레트 추천
- 오늘 입기 좋은 코디와 구매하면 좋은 날씨 아이템 분리

### 3. 스타일 기반 브랜드 추천

- streetwear
- minimal
- casual
- versatile 브랜드 추천

### 4. 날씨 기반 쇼핑 추천

- 비: 우산, 레인부츠, 방수 재킷, 방수 가방
- 바람: 윈드브레이커
- 더위: 린넨 셔츠, 선글라스
- 추위: 머플러, 보온 이너웨어
- 습도: 통기성 좋은 티셔츠
- 쿠팡, 네이버쇼핑, 무신사 검색 링크 생성

### 5. 사용자 취향 기반 개인화

- 선호 핏
- 선호 색상
- 예산대
- 피하고 싶은 아이템

### 6. 확장 예정 기능

- 사용자 스타일 프로필 수집
- 평소 선호하는 핏, 색상, 브랜드 기반 피드백
- 개인 옷장 기반 매칭 추천
- 요즘 뜨는 브랜드와 트렌드 가중치 반영
- 모바일 웹 또는 PWA 출시

## 기술 스택

- Node.js
- Express
- OpenWeather API
- Node.js built-in test runner

## 프로젝트 구조

```text
backend/
  server.js
  config/
    config.js
  routes/
    outfit.js
  services/
    weatherService.js
    outfitService.js
    brandService.js
  middleware/
    errorHandler.js
  data/
    brands.json
    outfits.json
  utils/
    styleEngine.js
test/
  brandService.test.js
  outfitService.test.js
```

## 실행 방법

```bash
npm install
```

`.env.example`을 참고해 `.env` 파일을 설정합니다.

```env
OPENWEATHER_API=your_openweather_api_key
PORT=3000
```

서버 실행:

```bash
npm start
```

테스트 실행:

```bash
npm test
```

## API

### Health Check

```http
GET /health
```

### Outfit Recommendation

```http
GET /api/outfit?city=Seoul&style=streetwear&occasion=date
```

OpenWeather API 키가 없거나 데모 응답만 확인하고 싶을 때:

```http
GET /api/outfit?city=Seoul&style=streetwear&occasion=date&mock=true
```

비 오는 날 쇼핑 추천 데모:

```http
GET /api/outfit?city=Seoul&style=minimal&occasion=work&fit=regular&colors=black,gray&budget=mid&mock=true&mockWeather=rain
```

사용 가능한 예시 파라미터:

- `city`: Seoul, Tokyo, New York 등
- `style`: streetwear, minimal, casual
- `occasion`: daily, work, date, travel, school
- `mock`: true일 때 외부 API 없이 데모 날씨 데이터 사용
- `mockWeather`: rain, hot, cold, wind, humid
- `fit`: oversized, regular, wide 등
- `colors`: black,gray처럼 쉼표로 여러 색상 입력
- `budget`: low, mid, high 등
- `avoid`: suede,boots처럼 피하고 싶은 아이템 입력

예시 응답:

```json
{
  "weather": {
    "city": "Seoul",
    "temp": 18,
    "feelsLike": 17.4,
    "humidity": 62,
    "windSpeed": 2.1,
    "condition": "Clouds",
    "description": "few clouds",
    "rain": false
  },
  "recommendation": {
    "summary": "Seoul weather fits a streetwear look with polished casual.",
    "items": {
      "top": "long sleeve",
      "bottom": "jeans",
      "shoes": "sneakers",
      "layers": ["jacket"],
      "fit": "oversized",
      "palette": ["black", "earth tone"],
      "detail": "one accent item"
    },
    "mood": "polished casual",
    "reasons": [
      "Cool weather needs long sleeves and an outer layer."
    ],
    "personalization": [
      "Prioritized your preferred colors: black, gray."
    ],
    "matchingTips": [
      "Match long sleeve with jeans for a balanced silhouette.",
      "Use black, earth tone as the main color palette."
    ]
  },
  "shopping": [
    {
      "id": "compact-umbrella",
      "name": "compact umbrella",
      "category": "weather accessory",
      "reason": "Rainy weather makes a compact umbrella the easiest daily carry item.",
      "searchQuery": "black matte black umbrella mid price",
      "links": [
        {
          "marketplace": "Coupang",
          "url": "https://www.coupang.com/np/search?q=black%20matte%20black%20umbrella%20mid%20price"
        }
      ]
    }
  ],
  "brands": [
    "ADER Error",
    "thisisneverthat",
    "Covernat",
    "MUSINSA Standard"
  ]
}
```

현재 쇼핑 링크는 검색 편의를 위한 링크이며, 실제 제휴 링크는 아닙니다. 향후 쿠팡 파트너스 등 제휴 프로그램을 연결할 경우 앱 내 광고/제휴 고지를 추가해야 합니다.

## 출시 로드맵

### Phase 1. API MVP

- 서버 실행 안정화
- 날씨 API 연동
- 추천 로직 테스트
- README 정리

### Phase 2. Web App

- React 또는 Next.js 프론트엔드
- 도시, 스타일, 상황 입력 UI
- 추천 결과 카드
- 모바일 반응형 디자인

### Phase 3. Personalization

- 사용자 스타일 설문
- 선호 색상, 핏, 브랜드 저장
- 추천 결과 좋아요/싫어요 피드백
- 사용자별 추천 정확도 개선

### Phase 4. Growth

- PWA 적용
- 공유 가능한 오늘의 코디 카드
- SEO용 패션/날씨 추천 페이지
- 브랜드 트렌드 데이터 연동
- 배포와 분석 도구 연결
