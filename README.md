- [DB Model Link](https://app.quickdatabasediagrams.com/#/d/mGAcah)

- [API Documentation](https://documenter.getpostman.com/view/13515563/2sA35Ea3eH)


- Task

1. Implement MongoDB integration using mongodb-memory-server for storing profile data instead of in-memory storage.

2. Create a POST route for creating new profiles, reusing the same image for all profiles.

3. Update the GET route to handle profile IDs in the URL, fetching corresponding profiles from the database.

4. Implement a backend API supporting commenting and voting functionalities.

5. Assume frontend will interact with the backend API to handle user accounts, comment posting, sorting/filtering comments, and liking/unliking comments.

6. Store all data in the same MongoDB database used in Part 1.

7. Add automated tests to verify the implementation of Part 1 and Part 2, ensuring functionality and correctness.

- Unit Testing

 -> using Jest
    test command : npm run test


 -> project run command :  npm run dev


NOTE:- For api testing purposes by mongodb memory server , some dependency


url - /api/v1/comments/create 
dependency - postId, userId

url - /api/v1/comments/:commentId/like-unlike
dependency - commentId
-

url - /api/v1/comments/:commentId/vote-personality-systems
dependency - commentId