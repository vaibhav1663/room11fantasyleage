"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { format, set } from "date-fns";
import Link from 'next/link';

export default function CreateRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    startTime: '',
    endTime: ''
  });

  // Time selection states
  const [startHour, setStartHour] = useState('12');
  const [startMinute, setStartMinute] = useState('00');
  const [startAmPm, setStartAmPm] = useState('AM');
  const [endHour, setEndHour] = useState('12');
  const [endMinute, setEndMinute] = useState('00');
  const [endAmPm, setEndAmPm] = useState('AM');

  const fetchMatches = async () => {
    try {
      const response = await fetch('https://apis.fancraze.com/challenge3/challenge/V3/getChallengeMatchesBff?pageSize=10&pageNumber=1&tab=UPCOMING&filter=all&myGames=0', {
        headers: {
          'source': 'WEB'
        }
      });
      const data = await response.json();
      setMatches(data.data.matches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const convertTo24Hour = (hour: string, ampm: string) => {
    let hourNum = parseInt(hour);
    if (ampm === 'PM' && hourNum !== 12) {
      hourNum += 12;
    } else if (ampm === 'AM' && hourNum === 12) {
      hourNum = 0;
    }
    return hourNum.toString().padStart(2, '0');
  };

  const convertTo12Hour = (hour24: string) => {
    let hourNum = parseInt(hour24);
    let ampm = hourNum >= 12 ? 'PM' : 'AM';
    if (hourNum === 0) hourNum = 12;
    if (hourNum > 12) hourNum -= 12;
    return {
      hour: hourNum.toString(),
      ampm
    };
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const hour24 = convertTo24Hour(startHour, startAmPm);
    const newDate = set(date, {
      hours: parseInt(hour24),
      minutes: parseInt(startMinute)
    });
    
    setFormData({
      ...formData,
      startTime: newDate.toISOString()
    });
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const hour24 = convertTo24Hour(endHour, endAmPm);
    const newDate = set(date, {
      hours: parseInt(hour24),
      minutes: parseInt(endMinute)
    });
    
    setFormData({
      ...formData,
      endTime: newDate.toISOString()
    });
  };

  const handleStartTimeChange = (hour: string, minute: string, ampm: string) => {
    setStartHour(hour);
    setStartMinute(minute);
    setStartAmPm(ampm);
    
    if (formData.startTime) {
      const hour24 = convertTo24Hour(hour, ampm);
      const date = new Date(formData.startTime);
      const newDate = set(date, {
        hours: parseInt(hour24),
        minutes: parseInt(minute)
      });
      setFormData({
        ...formData,
        startTime: newDate.toISOString()
      });
    }
  };

  const handleEndTimeChange = (hour: string, minute: string, ampm: string) => {
    setEndHour(hour);
    setEndMinute(minute);
    setEndAmPm(ampm);
    
    if (formData.endTime) {
      const hour24 = convertTo24Hour(hour, ampm);
      const date = new Date(formData.endTime);
      const newDate = set(date, {
        hours: parseInt(hour24),
        minutes: parseInt(minute)
      });
      setFormData({
        ...formData,
        endTime: newDate.toISOString()
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          teams: [],
          startTime: new Date(formData.startTime),
          endTime: new Date(formData.endTime)
        }),
      });

      if (!response.ok) throw new Error('Failed to create room');

      const room = await response.json();
      router.push(`/rooms/${room._id}`);
      
      setLoading(false);
    } catch (error) {
      alert('Error creating room:'+ error);
      setLoading(false);
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-3 pt-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/rooms" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Rooms
        </Link>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Create New Room
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  placeholder="Enter room name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Select Match</Label>
                <div className="grid gap-4">
                  {matches.map((match : any) => (
                    <div
                      key={match.match_id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.slug === match.modes[0]
                          ? 'bg-purple-900/50 border-purple-500'
                          : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => {
                        const startDate = new Date(match.start_date);
                        const { hour, ampm } = convertTo12Hour(startDate.getHours().toString());
                        setStartHour(hour);
                        setStartAmPm(ampm);
                        setStartMinute(startDate.getMinutes().toString().padStart(2, '0'));
                        
                        const endDate = new Date(new Date(match.start_date).getTime());
                        const endTime = convertTo12Hour(endDate.getHours().toString());
                        setEndHour(endTime.hour);
                        setEndAmPm(endTime.ampm);
                        setEndMinute(endDate.getMinutes().toString().padStart(2, '0'));
                        
                        setFormData({
                          ...formData,
                          slug: match.modes[0],
                          startTime: match.start_date,
                          endTime: endDate.toISOString()
                        });
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{match.title_alias}</h3>
                        <span className="text-sm text-gray-400">{match.format_str}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{format(new Date(match.start_date), 'PPP')}</span>
                        <span>{format(new Date(match.start_date), 'p')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Match Start Time</Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`flex-1 justify-start text-left font-normal bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:text-gray-100 ${
                          !formData.startTime && "text-white"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startTime ? (
                          format(new Date(formData.startTime), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.startTime ? new Date(formData.startTime) : undefined}
                        onSelect={handleStartDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="flex gap-2 ">
                    <Select value={startHour} onValueChange={(value) => handleStartTimeChange(value, startMinute, startAmPm)} >
                      <SelectTrigger className="w-[80px] bg-gray-800 text-white border-gray-700">
                        <SelectValue placeholder="Hour" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white border-gray-700">
                        {hours.map((hour) => (
                          <SelectItem className='focus:bg-gray-700 focus:text-white' key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={startMinute} onValueChange={(value) => handleStartTimeChange(startHour, value, startAmPm)}>
                      <SelectTrigger className="w-[80px] bg-gray-800 text-white border-gray-700">
                        <SelectValue placeholder="Min" />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-800 text-white border-gray-700 '>
                        {minutes.map((minute) => (
                          <SelectItem key={minute} value={minute} className='focus:bg-gray-700 focus:text-white'>
                            {minute}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={startAmPm} onValueChange={(value) => handleStartTimeChange(startHour, startMinute, value)}>
                      <SelectTrigger className="w-[80px] bg-gray-800 text-white border-gray-700">
                        <SelectValue placeholder="AM/PM" />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-800 text-white border-gray-700'>
                        <SelectItem value="AM" className='focus:bg-gray-700 focus:text-white'>AM</SelectItem>
                        <SelectItem value="PM" className='focus:bg-gray-700 focus:text-white'>PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Team Selection Deadline</Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`flex-1 justify-start text-left font-normal bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:text-gray-100 ${
                          !formData.endTime && "text-white"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endTime ? (
                          format(new Date(formData.endTime), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.endTime ? new Date(formData.endTime) : undefined}
                        onSelect={handleEndDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="flex gap-2">
                    <Select value={endHour} onValueChange={(value) => handleEndTimeChange(value, endMinute, endAmPm)}>
                      <SelectTrigger className="w-[80px] bg-gray-800 text-white border-gray-700">
                        <SelectValue placeholder="Hour" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white border-gray-700">
                        {hours.map((hour) => (
                          <SelectItem key={hour} value={hour} className='focus:bg-gray-700 focus:text-white'>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={endMinute} onValueChange={(value) => handleEndTimeChange(endHour, value, endAmPm)}>
                      <SelectTrigger className="w-[80px] bg-gray-800 text-white border-gray-700">
                        <SelectValue placeholder="Min" />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-800 text-white border-gray-700'>
                        {minutes.map((minute) => (
                          <SelectItem key={minute} value={minute} className='focus:bg-gray-700 focus:text-white'>
                            {minute}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={endAmPm} onValueChange={(value) => handleEndTimeChange(endHour, endMinute, value)}>
                      <SelectTrigger className="w-[80px] bg-gray-800 text-white border-gray-700">
                        <SelectValue placeholder="AM/PM" />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-800 text-white border-gray-700'>
                        <SelectItem value="AM" className='focus:bg-gray-700 focus:text-white'>AM</SelectItem>
                        <SelectItem value="PM" className='focus:bg-gray-700 focus:text-white'>PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Teams must be created before this deadline
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading || !formData.name || !formData.slug || !formData.startTime || !formData.endTime}
              >
                {loading ? 'Creating...' : 'Create Room'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}