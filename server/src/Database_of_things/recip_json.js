"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://api.eda.ru/v2/graphql", {
            // credentials: "omit",
            headers: {
                Accept: "*/*",
                "Accept-Language": "uk-UA,uk;q=0.8,en-US;q=0.5,en;q=0.3",
                "content-type": "application/json",
                // "Sec-Fetch-Dest": "empty",
                // "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
            },
            referrer: "https://eda.ru/",
            body: '[{"operationName":null,"variables":{},"query":"{\\n  recipes(\\n    request: {offset: 0, first: 100, sortField: CREATEDATE, sortDirection: DESC}\\n  ) {\\n    edges {\\n      node {\\n        id\\n        name\\n        createUser {\\n          fullName\\n          id\\n          photo\\n          recipesCount\\n          followersCount\\n          followingsCount\\n          personalProps {\\n            isFollowed\\n            __typename\\n          }\\n          __typename\\n        }\\n        slug\\n        imageUrl\\n        relativeUrl\\n        videoFileId\\n        recipeCategory {\\n          name\\n          slug\\n          __typename\\n        }\\n        cuisine {\\n          name\\n          slug\\n          __typename\\n        }\\n        composition {\\n          amount\\n          ingredient {\\n            id\\n            name\\n            accusativeCase\\n            instrumentalCase\\n            genitiveCase\\n            relativeUrl\\n            shortDescription\\n            recipesCount\\n            slug\\n            catalogPhoto\\n            __typename\\n          }\\n          measureUnit {\\n            id\\n            name\\n            nameFive\\n            nameFractional\\n            nameTwo\\n            isDimensionless\\n            __typename\\n          }\\n          __typename\\n        }\\n        portionsCount\\n        cookingTime\\n        likes\\n        dislikes\\n        inCookbookCount\\n        isSpecialProject\\n        isEditorChoice\\n        isGold1000\\n        navigationTags {\\n          id\\n          name\\n          slug\\n          __typename\\n        }\\n        aggregateRating {\\n          bestRating\\n          ratingValue\\n          reviewCount\\n          worstRating\\n          __typename\\n        }\\n        personalProps {\\n          isInCookbook\\n          isLiked\\n          isDisliked\\n          cookMenuIds\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    totalCount\\n    __typename\\n  }\\n}\\n"}]',
            method: "POST",
            // mode: "cors",
        });
        let b = yield response.json();
        console.dir(b.data.recipes.edges[0].node);
        const recip_json = JSON.stringify(b.data.recipes.edges);
        fs_1.default.writeFile("recipes.json", recip_json, "utf-8", (err) => {
            if (err)
                throw err;
            console.log("Complete!");
        });
    });
}
test();
