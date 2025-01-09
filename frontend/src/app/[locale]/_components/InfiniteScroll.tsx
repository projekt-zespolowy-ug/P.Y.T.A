"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {
	isLoadingIntial: boolean;
	isLoadingMore: boolean;
	children: React.ReactNode;
	loadMore: () => void;
};

function InfiniteScroll(props: Props) {
	const observerElement = useRef<HTMLDivElement | null>(null);
	const { isLoadingIntial, isLoadingMore, children, loadMore } = props;

	useEffect(() => {
		function handleIntersection(entries: IntersectionObserverEntry[]) {
			for (const entry of entries) {
				if (entry.isIntersecting && (!isLoadingMore || !isLoadingIntial)) {
					loadMore();
				}
			}
		}

		const observer = new IntersectionObserver(handleIntersection, {
			root: null,
			rootMargin: "100px",
			threshold: 0,
		});

		if (observerElement.current) {
			observer.observe(observerElement.current);
		}

		return () => observer.disconnect();
	}, [isLoadingMore, isLoadingIntial, loadMore]);

	return (
		<>
			{children}

			<div ref={observerElement} id="obs">
				{isLoadingMore && !isLoadingIntial && (
					<LoaderCircle className="mx-auto my-10 animate-spin" />
				)}
			</div>
		</>
	);
}

export default InfiniteScroll;
