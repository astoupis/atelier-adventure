
/* THE DECLARATION OF SOCKET INDEPENDENCE
/* -------------------------------------- 
 * 
 * Here the project's socket declaration,
 * which describes, what should sockets
 * of atelier-adventure implement.
 * 
 * 1. CONNECT message:
 *      * Goes from client to server
 *      * Contains the board or the user `id`,
 *        array, whose tracking the client 
 *        wants to initiate.
 *      * Forces the server to send the events 
 *        about the objects of interest to 
 *        the client.
 *        
 * 2. TASK.UPDATE message:
 *      * Goes from server to client
 *      * Contains the task `id`, 
 *        the list `id`, the board `id`,
 *        which was updated and has to be
 *        refetched from the server.
 *      * Forces the client to update 
 *        the contents of the task.
 * 
 * 3. LIST.UPDATE message:
 *      * Goes from server to client
 *      * Contains the list `id`, 
 *        the board `id`, whose
 *        contents were updated, and
 *        also the boolean `wipe` parameter,
 *        which states that the list should be
 *        rerendered completely.
 *      * Forces the client to update the
 *        contents of the list.
 *      * NOTE: LIST UPDATE IMPLIES 
 *              TASK ADD/DELETE/MOVE
 *              OPERATIONS
 * 
 * 4. BOARD.UPDATE message:
 *     * Goes from server to client
 *     * Contains the board `id`, whose contents
 *       were updated and rquire refetch, and
 *       a boolean `wipe` parameter, which states
 *       that the board should be rerendered
 *       completely.
 *     * Forces the client to update the contents
 *       of the board.
 *     * NOTE: BOARD UPDATE IMPLIES 
 *             LIST ADD/DELETE/MOVE
 *             OPERATIONS
 * 
/* -------------------------------------- */


/**
 * Sets a socket callback handler, given an array of string ids of
 * the objects of interest. Is used to update the page content based
 * on the behavior of other client systems.
 * @param {[string]} idArray the array of ids of users and boards, 
 *        in which the client is interested to get notifications
 * @author wize
 * @version 0 (14 Dec 2018)
 */
function activateSocket(idArray) {
    /* ---- INSTANTIATING THE SOCKET ---- */
    const socket = io();


    /* ---- CONNECTING THE SOCKET ---- */
    socket.emit("CONNECT", idArray);


    /* ---- SETTING INCOMING MESSAGE HANDLERS ---- */
    socket.on("TASK.UPDATE", function(queryObject) {
        // CALLBACK ON TASK CONTENT UPDATE
        taskGet(
            queryObject.taskId,
            queryObject.listId,
            queryObject.boardId
        );
    });

    socket.on("LIST.UPDATE", function(queryObject) {
        // CALLBACK ON LIST CONTENT UPDATE
        listGetTasks(
            queryObject.listId,
            queryObject.boardId,
            queryObject.wipe
        );
    });

    socket.on("BOARD.UPDATE", function(queryObject) {
        // CALLBACK ON BOARD CONTENT UPDATE
        boardGetLists(
            queryObject.boardId,
            queryObject.wipe
        );
    });
}

