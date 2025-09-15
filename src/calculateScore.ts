/**
 * Convert fuse.js score to flowlauncher score
 * 
 * - fuse.js score is between 0 and 1, where 0 is a perfect match and 1 is a complete mismatch
 * - flowlauncher score is between 0 and 100, where 100 is a perfect match and 0 is a complete mismatch
 */
export default (fuseScore: number): number => {
    const roundedScore = Math.round(fuseScore * 100);
    
    if (0 === roundedScore) return 100;
    if (roundedScore === 1) return 0;

    return 100 - roundedScore;
}