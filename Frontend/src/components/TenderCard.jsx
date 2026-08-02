import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from './Card'
import Button from './Button';

import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function TenderCard({ tender }) {
  const { _id, title, category, budget, deadline, city } = tender;
  // console.log("Tender",tender)
  // console.log("Budget",title)
  return (
    <Card className="shadow-sm hover:shadow-md transition p-4">
      <CardHeader>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{category} • {city}</p>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-gray-700 mb-2">Budget: ₹{budget}</p>
        <p className="text-gray-700">Deadline: {format(new Date(deadline), 'dd MMM yyyy')}</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link to={`/tenders/${_id}`}>
          <Button variant="outline" asChild>
            View Details
          </Button></Link>
      </CardFooter>
    </Card>
  );
}