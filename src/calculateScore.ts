export default (fuseScore: number): number => {
    const roundedScore = Math.round(fuseScore * 100);
    
    if (0 === roundedScore) return 100;
    if (1 === roundedScore) return 0;

    return 100 - roundedScore;
}