# Weather Outfit Recommender

날씨 정보를 기반으로 오늘 입기 좋은 옷을 추천해주는 간단한 백엔드 서비스입니다.

OpenWeather API를 이용해 현재 날씨 데이터를 가져오고,
온도와 스타일에 따라 기본 코디와 브랜드를 추천합니다.

---

## 기술 스택

- Node.js
- Express
- OpenWeather API

---

## 프로젝트 구조
backend
├ server.js
├ config
│ └ config.js
├ routes
│ └ outfit.js
├ services
│ ├ weatherService.js
│ ├ outfitService.js
│ └ brandService.js
├ middleware
│ └ errorHandler.js
├ data
│ ├ brands.json
│ └ outfits.json
└ utils
└ styleEngine.js

---

## 동작 방식

1. 사용자가 도시와 스타일을 입력합니다.
2. OpenWeather API에서 해당 도시의 날씨 데이터를 가져옵니다.
3. 온도를 기준으로 기본 코디를 선택합니다.
4. 스타일 엔진이 코디의 핏과 색상 팔레트를 보정합니다.
5. 스타일에 맞는 패션 브랜드를 함께 추천합니다.

---

## 실행 방법

의존성 설치


---

## 동작 방식

1. 사용자가 도시와 스타일을 입력합니다.
2. OpenWeather API에서 해당 도시의 날씨 데이터를 가져옵니다.
3. 온도를 기준으로 기본 코디를 선택합니다.
4. 스타일 엔진이 코디의 핏과 색상 팔레트를 보정합니다.
5. 스타일에 맞는 패션 브랜드를 함께 추천합니다.

---

## 실행 방법

의존성 설치

---

## 동작 방식

1. 사용자가 도시와 스타일을 입력합니다.
2. OpenWeather API에서 해당 도시의 날씨 데이터를 가져옵니다.
3. 온도를 기준으로 기본 코디를 선택합니다.
4. 스타일 엔진이 코디의 핏과 색상 팔레트를 보정합니다.
5. 스타일에 맞는 패션 브랜드를 함께 추천합니다.

---

## 실행 방법

의존성 설치

npm install

환경 변수 설정

OPENWEATHER_API=your_api_key

서버 실행

npm start

---

## API

### 코디 추천

GET /api/outfit?city=Seoul&style=streetwear

### 예시 응답

{
"weather": {
"city": "Seoul",
"temp": 18,
"condition": "Clouds"
},
"outfit": {
"top": "long sleeve",
"bottom": "jeans",
"shoes": "sneakers",
"layers": ["jacket"],
"fit": "oversized",
"palette": ["black","earth tone"]
},
"brands": [
"ADER Error",
"thisisneverthat",
"Covernat"
]
}

---

## 참고

이 프로젝트는 간단한 규칙 기반 추천 로직으로 구현되어 있으며  
추후 다음과 같은 확장이 가능합니다.

- 날씨 위치 자동 감지
- 코디 이미지 추천
- 추천 알고리즘 개선