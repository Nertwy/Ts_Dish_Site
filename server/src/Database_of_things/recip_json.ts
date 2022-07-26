import fs from "fs";
async function test() {
  const response = await fetch("https://api.eda.ru/v2/graphql", {
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
  let b = await response.json();
  console.dir(b.data.recipes.edges[0].node);
  const recip_json = JSON.stringify(b.data.recipes.edges);
  fs.writeFile("recipes.json", recip_json, "utf-8", (err) => {
    if (err) throw err;
    console.log("Complete!");
  });
}

test();
