import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import primsa from '@/app/libs/prismadb';

interface IParams {
    reservationId?: string;
};

export async function DELETE(request : Request, {params} : {params: IParams}) {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return NextResponse.error();
    }

    const { reservationId } = params;

    if(!reservationId || typeof reservationId !== 'string') {
       throw new Error('Invalid reservation id');
    }

    const reservation = await primsa.reservation.deleteMany({
        where: {
            id: reservationId,
            OR: [
                {userId: currentUser.id}, //creator of resevation
                {listing: {userId: currentUser.id}}, //creator of the listing that the reservation is for
            ]
        }
    });

    return NextResponse.json(reservation);
}