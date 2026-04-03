import 'package:flutter/material.dart';


class reccomendations extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    //organziation
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation:0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.black),
          onPressed: () {
            Navigator.pop(context); // This "pops" the screen and goes back
          },
        ),
      ),

      body: SafeArea(

        child: SingleChildScrollView(

          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                'Check your Inbox',
                style:TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 30
                ),),
              const SizedBox(height:10),

              Text(
                  'We sent',
                  style:TextStyle(
                      fontWeight: FontWeight.normal,
                      fontSize: 20
                  )),


            ],
          ),
        ),
      ),
    );
  }
}