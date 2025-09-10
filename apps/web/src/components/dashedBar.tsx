export const CustomDashedBar = (props: any) => {
	const { x, y, width, height, fill = "hsl(var(--accent))", stroke = "hsl(var(--chart-3))", strokeWidth = 1 } = props;

	const pid = `dashPattern-${x}-${y}-${width}-${height}`;

	const dashColor = "hsl(var(--chart-3))";
	// space between dashed rows
	const dashGap = 6;
	const dashLen = 4;
	const dashSpace = 6;

	return (
		<svg x={0} y={0} width={0} height={0} style={{ overflow: "visible" }}>
			<title>Dashed bar pattern</title>
			<defs>
				<pattern
					id={pid}
					patternUnits="userSpaceOnUse"
					width={dashLen + dashSpace}
					height={dashGap}
					patternTransform="rotate(45)"
				>
					<line
						x1="0"
						y1={dashGap / 2}
						x2={dashLen + dashSpace}
						y2={dashGap / 2}
						stroke={dashColor}
						strokeWidth="1"
						strokeDasharray={`${dashLen} ${dashSpace}`}
					/>
				</pattern>
			</defs>

			{/* Outer bar body */}
			<rect x={x} y={y} width={width} height={height} fill={fill} stroke={stroke} strokeWidth={strokeWidth} rx={2} />

			{/* Pattern overlay clipped to the bar */}
			<rect x={x} y={y} width={width} height={height} fill={`url(#${pid})`} />
		</svg>
	);
};
