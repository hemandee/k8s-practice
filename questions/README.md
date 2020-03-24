---

## Convert Markdown to JSON Object 

JSON object will be used a flat data storage for question set. Folder names inside question_set map to 
category names shown in [CKA and CKAD Curriculum](https://github.com/cncf/curriculum).

toJSON.js is adapted from [markdown-to-js](https://github.com/scottstanfield/markdown-to-json/tree/1f672307ae360fcd0abbae1e0dfe5caba46e8e6e)

### Format of questions
Tags are needed to categorize questions. Allows a question to be used in both CKA and CKAD.


```
---
question_no: INCREMNTAL_QUESTION_NUMBER
question: QUESTION_TEXT_ONLY
author: 
    - AUTHOR_NAME
    - AUTHOR_NAME
tags: 
    - CORE_CONCEPTS 
    - EXAM
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