import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { fetchProductReviews, submitProductReview, ApiReview } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

interface ReviewSectionProps {
    productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
    const { user, isAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: reviews, isLoading } = useQuery<ApiReview[]>({
        queryKey: ['reviews', productId],
        queryFn: () => fetchProductReviews(productId),
        enabled: !!productId,
    });

    const submitMutation = useMutation({
        mutationFn: (newReview: { rating: number; comment: string; userName: string }) =>
            submitProductReview(productId, newReview),
        onSuccess: () => {
            toast.success('Review submitted successfully!');
            setComment('');
            setRating(5);
            // Invalidate both reviews and product to update overall rating
            queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
            queryClient.invalidateQueries({ queryKey: ['product', productId] });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to submit review');
        },
        onSettled: () => setIsSubmitting(false),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error('Please write a comment');
            return;
        }
        setIsSubmitting(true);
        submitMutation.mutate({
            rating,
            comment,
            userName: user?.name || 'Anonymous User',
        });
    };

    return (
        <div className="mt-16 border-t border-border pt-10">
            <h2 className="mb-8 font-display text-3xl font-bold text-foreground">Customer Reviews</h2>

            <div className="grid gap-10 md:grid-cols-12">
                {/* Write a Review Form */}
                <div className="md:col-span-5 md:pr-8">
                    <h3 className="mb-4 text-xl font-semibold">Write a Review</h3>
                    {isAuthenticated ? (
                        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            className="focus:outline-none"
                                            onClick={() => setRating(star)}
                                        >
                                            <Star
                                                className={`h-6 w-6 ${star <= rating ? 'fill-primary text-primary' : 'text-muted'
                                                    } transition-colors hover:text-primary`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">Your Review</label>
                                <Textarea
                                    rows={4}
                                    placeholder="What did you think about this product?"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="resize-none"
                                />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </form>
                    ) : (
                        <div className="rounded-xl border border-border bg-card p-6 text-center">
                            <p className="mb-4 text-muted-foreground">Please log in to leave a review.</p>
                            <Button asChild variant="outline">
                                <a href="/login">Log In</a>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Reviews List */}
                <div className="md:col-span-7">
                    <h3 className="mb-4 text-xl font-semibold">
                        {reviews?.length} {reviews?.length === 1 ? 'Review' : 'Reviews'}
                    </h3>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-24 animate-pulse rounded-xl bg-secondary/50" />
                            ))}
                        </div>
                    ) : reviews && reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review._id} className="rounded-xl border border-border bg-card p-6">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="font-semibold text-foreground">{review.userName}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                        </span>
                                    </div>
                                    <div className="mb-3 flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= review.rating ? 'fill-primary text-primary' : 'text-muted'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20">
                            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
