/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var pacificAtlantic = function (matrix) {
    let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let m = matrix.length;
    let n = matrix[0].length;
    let ans = [];
    let canReachPcf = generateArray(m,n);
    let canReachAlt =  generateArray(m,n);
    for (let i = 0; i < m; i++) {
        dfs(i, 0, canReachPcf);
        dfs(i, n - 1, canReachAlt);
    }
    for (let i = 0; i < n; i++) {
        dfs(0, i, canReachPcf);
        dfs(m - 1, i, canReachAlt);
    }
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (canReachPcf[i][j] === true && canReachAlt[i][j] === true) {
                ans.push([i, j]);
            }
        }
    }

    return ans;

    function generateArray(m,n){
        let res = [];
        for(let i = 0;i < m;i++){
            res.push([]);
        }
        return res;
    }
    
    function dfs(x, y, canReach) {

        if (canReach[x][y] === true){
            return;
        }
        canReach[x][y] = true;
        for (let direction of directions) {
            let new_x = x + direction[0];
            let new_y = y + direction[1];
            if (new_x < 0 || new_x >= m || new_y < 0 || new_y >= n || matrix[x][y] > matrix[new_x][new_y]) {
                continue;
            }
            dfs(new_x, new_y, canReach);
        }
    }
};
console.log(pacificAtlantic([[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]));