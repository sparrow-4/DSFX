# Debugging Order History

The user is reporting that their orders are not showing up in the account dashboard.

## Findings
1. Orders are being saved, but `userId` is missing from the database records.
2. The frontend `createOrder` API call may not be successfully sending the `Authorization` header.
3. The backend `POST /orders` route might be failing to verify the token or extracting the wrong ID format.

## Plan
1. Check `backend/server.js` for CORS configuration (if browser port 8080 vs backend 5000).
2. Add more logging to `backend/routes/orders.js` to see if tokens are arriving.
3. Test if `localStorage.getItem('spark-auth-storage')` correctly contains the token in the frontend.
