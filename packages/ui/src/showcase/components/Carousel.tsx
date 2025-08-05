import {
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from "@/components/datadisplay/carousel";
import { Card, CardContent } from "@/components/general/card";

export default function CarouselSize() {
	return (
		<>
			<p>Horizontal Carousel</p>
			<Carousel
				opts={{
					align: "center",
					loop: true
				}}
				className="w-full max-w-sm"
			>
				<CarouselContent>
					{Array.from({ length: 5 }).map((_, index) => (
						<CarouselItem key={crypto.randomUUID()} className="basis-[80%]">
							<div className="p-1">
								<Card>
									<CardContent className="flex aspect-square items-center justify-center p-6">
										<span className="text-3xl font-semibold">{index + 1}</span>
									</CardContent>
								</Card>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<div className="mt-2 flex justify-between">
					<div className="flex gap-2">
						<CarouselPrevious />
						<CarouselNext />
					</div>
					<CarouselDots />
				</div>
			</Carousel>
			<p className="mt-5">Vertical Carousel</p>
			<Carousel
				opts={{
					align: "center",
					loop: true
				}}
				className="w-full max-w-sm"
				orientation="vertical"
			>
				<CarouselContent className="h-[280px]">
					{Array.from({ length: 5 }).map((_, index) => (
						<CarouselItem key={crypto.randomUUID()} className="h-[200px]">
							<Card>
								<CardContent className="h-[200px] flex aspect-square items-center justify-center p-6">
									<span className="text-3xl font-semibold">{index + 1}</span>
								</CardContent>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>
				<div className="mt-2 flex justify-between">
					<div className="flex gap-2">
						<CarouselPrevious />
						<CarouselNext />
					</div>
					<CarouselDots />
				</div>
			</Carousel>
		</>
	);
}
