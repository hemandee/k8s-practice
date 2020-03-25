---

## Convert Markdown to JSON Object 

JSON object will be used a flat data storage for question set. Folder names are similar to the to 
category names shown in [CKA and CKAD Curriculum](https://github.com/cncf/curriculum).

toJSON.js is adapted from [markdown-to-js](https://github.com/scottstanfield/markdown-to-json/tree/1f672307ae360fcd0abbae1e0dfe5caba46e8e6e)

### How to run

To compile locally

```bash
$node toJson.js -l -m question_set/
```

To watch folder and compile locally
```bash
$node toJson.js --watch -l question_set/
```

### Output

```
{
"lastModified": ISO_DATE,
"qlength":TOTAL_NUMBER_OF_QUESTIONS,
"question_set": {
  "FOLDER_NAME": [],
  "FOLDER_NAME_TWO" : []
    },
}       


```

### Format of questions

```
---
question_no: INCREMNTAL_QUESTION_NUMBER
question: QUESTION_TEXT_ONLY
author: 
    - AUTHOR_NAME
    - AUTHOR_NAME
tags: 
    - Core Concepts
    - Pods
    - 
answer: "
    ```bash
    # Remember to have kubectl installed
    kubectl create namespace mynamespace
    kubectl run nginx --image=nginx --restart=Never -n mynamespace
    ```
    "
reference:
   - "[Creating Namespace](https://kubernetes.io/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace)"
   - "[Run Pod in Namespace](https://kubernetes.io/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace)" 
---
```


### Miscellaneous Notes

- https://www.cncf.io/blog/2019/05/10/kubernetes-core-concepts/
